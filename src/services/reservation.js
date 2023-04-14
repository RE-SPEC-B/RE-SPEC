'use strict';

const { Mentorinfo, Reservation, LogReservation, UserCoupon } = require('../utils/connect');

const { checkDuplicateDates } = require('../functions/common');

const { Op, fn, col, Transaction } = require('sequelize');
const { sequelize } = require('../utils/connect');

/**
 * 고객 ID, 멘토 ID, 예약정보를 받아 저장합니다.
 * 포트폴리오(PT) 예약일 경우 링크도 함께 저장합니다.
 *
 * @param {number} user_id 예약을 생성하는 유저. 멘티의 ID
 * @param {number} mentor_id 예약을 신청받는 멘토의 ID
 * @param {string} type 예약 타입. 멘토링MT 또는 포트폴리오 첨삭PT
 * @param {number} duration 신청하는 예약의 진행시간
 * @param {Date} proposed_start1 신청하는 예약의 첫번째 제안시간
 * @param {Date} proposed_start2 신청하는 예약의 두번째 제안시간
 * @param {Date} proposed_start3 신청하는 예약의 세번째 제안시간
 * @param {string} question 멘토에게 보내는 질문
 * @param {string} link 포트폴리오 링크(포트폴리오 첨삭 신청 시 수집)
 * @param {number} coupon_id 쿠폰 사용했다면 쿠폰 ID
 * @returns
 */
exports.reserve = async (user_id, mentor_id, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link, user_coupon_id) => {
    if (await checkDuplicateDates(proposed_start1, proposed_start2, proposed_start3)) {
        throw new Error('Reservation times cannot be the same.');
    }

    const transaction = await sequelize.transaction();
    try {
        // 쿠폰 사용 시 쿠폰 상태 변경
        if(user_coupon_id) {
            await UserCoupon.update({ status: 'RESERVED' }, { where: { id: user_coupon_id } }, { transaction: transaction });
        };
        
        const reservation = await Reservation.create({
                type: type == 'MT' ? 'MT' : 'PT',
                duration: duration,
                status: 'WAITING',
                proposed_start1: proposed_start1,
                proposed_start2: proposed_start2,
                proposed_start3: proposed_start3,
                question: question,
                link: type == 'PT' ? link : '',
                user_id: user_id,
                mentor_id: mentor_id,
                user_coupon_id: user_coupon_id
            },
            { transaction: transaction },
        );

        // 예약 로그 기록
        const log_reservation_data = { reservation_id: reservation.id, status_from: '', status_to: 'WAITING' };
        await LogReservation.create(log_reservation_data, { transaction: transaction });
        await transaction.commit();

        return reservation;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 멘토의 ID를 바탕으로 멘토 정보와 신청 유저와 일치하는지 확인해서
 * 예약 가능한 멘토인지 검증 함수
 *
 * @param {*} user_id 예약을 신청받는 유저 ID
 * @param {*} mentor_id 예약을 신청받는 멘토의 ID
 * @returns boolean 예약 검증 결과
 */
exports.validateMentor = async (user_id, mentor_id) => {
    return await Mentorinfo.findOne({ where: { id: mentor_id } }).then((mentorInfo) => {
        if (!mentorInfo) throw new Error('Invalid Mentor!');
        return user_id != mentorInfo.user_id;
    });
};

/**
 * 유저 ID와 쿠폰 ID를 바탕으로 유효한 쿠폰인지 검증하는 함수
 * 
 *
 * @param {*} user_id 예약을 신청받는 유저 ID
 * @param {*} coupon_id 예약 확정 시 사용할 쿠폰 ID
 * @returns boolean 예약 검증 결과
 */
exports.validateCoupon = async (user_id, coupon_id) => {
    // 아직 쿠폰 기한에 대한 정확한 정책이 나오지 않았으니 다운로드가 오늘날짜인지만 검증
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // download_date가 today 보다 큰 쿠폰이 있는지 검증
    return await UserCoupon.findOne({ where: { coupon_id: coupon_id, user_id: user_id, status: 'UNUSED', download_date: { [Op.gt]: today } } });
};

/**
 * 유저ID 정보을 바탕으로, 멘토ID를 반환하는 함수
 *
 * @param {*} user_id 멘토의 유저ID
 * @returns
 */
exports.getMentorId = async (user_id) => {
    return await Mentorinfo.findOne({ where: { user_id: user_id } }).then((mentorInfo) => {
        if (!mentorInfo) return;
        return mentorInfo.id;
    });
};

/**
 * 예약 키 정보을 바탕으로, 멘토에게 예약된 정보가 맞는지
 * 확인하고 반환하는 함수
 *
 * @param {*} reservation_id 예약 ID
 * @param {*} mentor_id 멘토 ID
 * @returns
 */
exports.checkWaitingReservation = async (reservation_id, mentor_id) => {
    return await Reservation.findOne({
        where: { status: 'WAITING', id: reservation_id, mentor_id: mentor_id },
    });
};

/**
 * 예약 키, 시작 시간 정보을 바탕으로
 * 예약을 확정하는 함수
 * @param {*} reservation_id 예약 ID
 * @param {*} start 확정된 멘토링 시작 시간
 * @returns
 */
exports.confirm = async (reservation_id, start) => {
    // TODO: 확정 시간이 반드시 제안 시간 중 하나여야 한다는 정책이 없기때문에 정책이 명확해지면 작업할 예정
    const now = new Date();
    const transaction = await sequelize.transaction();

    try {
        const reservation =  await Reservation.findOne({
            where: { id: reservation_id },
        });

        // 쿠폰 있을 시 사용 처리
        if (reservation.user_coupon_id) {
            await UserCoupon.update(
                { status: 'USED' },
                { where: { id: reservation.user_coupon_id } },
                { transaction: transaction },
            );
        }

        await Reservation.update(
            { status: 'CONFIRMED', start: start, updatedAt: now },
            { where: { id: reservation_id } },
            { transaction: transaction },
        );
        // 예약 로그 기록
        const logReservationData = { reservation_id: reservation_id, status_from: 'WAITING', status_to: 'CONFIRMED' };
        await LogReservation.create(logReservationData, { transaction: transaction });

        await transaction.commit();
        return reservation;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 재신청 여부를 적용하여
 * 예약을 반려하는 함수
 * @param {*} reservation_id 예약 ID
 * @param {*} start 확정된 멘토링 시작 시간
 * @returns
 */
exports.reject = async (reservation_id, isReapplyAvailable) => {
    // TODO: 최초예약, 반려, 재예약 등 예약 관련 로깅 작업
    let status = isReapplyAvailable ? 'REAPPLIED_REQUEST' : 'REJECTED';
    const transaction = await sequelize.transaction();

    try {
        if (status === 'REJECTED') {
            const reservation =  await Reservation.findOne({
                where: { id: reservation_id },
            });

            console.log(reservation.user_coupon_id);
            // 쿠폰 있을 시 사용 처리
            if (reservation.user_coupon_id) {
                await UserCoupon.update(
                    { status: 'UNUSED' },
                    { where: { id: reservation.user_coupon_id } },
                    { transaction: transaction },
                );
            }
        }

        await Reservation.update({ status: status }, { where: { id: reservation_id } }, { transaction: transaction });
        // 예약 로그 기록
        const logReservationData = { reservation_id: reservation_id, status_from: 'WAITING', status_to: status };
        await LogReservation.create(logReservationData, { transaction: transaction });
        await transaction.commit();

        // 참고: CONFIRMED 업데이트 이후, 해당 멘티에게 알림을 보내기위해, FCM정보가 필요합니다.
        // 따라서, 아래 코드를 삽입했고 작업하실땐, 지우셔도 됩니다.
        return await Reservation.findOne({
            attributes: [['user_id', 'user_id']],
            where: { id: reservation_id },
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 해당 멘토의 예약이 확정된 목록을 추출하는 함수
 * @returns {Object}
 */
exports.getReservationsOfMentor = async (mentor_id) => {
    return await Reservation.findAll({
        attributes: ['id', 'type', 'status', 'duration', 'start'],
        where: {[Op.and]: [{ status: 'CONFIRMED' }, { mentor_id: mentor_id }]}
    });
};
