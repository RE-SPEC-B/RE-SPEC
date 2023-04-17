'use strict';

const { User, Mentorinfo, Reservation, LogReservation, UserCoupon } = require('../utils/connect');

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
    return await Mentorinfo.findOne({ where: { id: mentor_id } }).then((mentor_info) => {
        if (!mentor_info) throw new Error('Invalid Mentor!');
        return user_id != mentor_info.user_id;
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
    console.log(user_id, coupon_id,today);

    // download_date가 today 보다 큰 쿠폰이 있는지 검증
    return await UserCoupon.findOne({ where: { id: coupon_id, user_id: user_id, status: 'UNUSED', download_date: { [Op.gt]: today } } });
};

/**
 * 유저ID 정보을 바탕으로, 멘토ID를 반환하는 함수
 *
 * @param {*} user_id 멘토의 유저ID
 * @returns
 */
exports.getMentorId = async (user_id) => {
    return await Mentorinfo.findOne({ where: { user_id: user_id } }).then((mentor_info) => {
        if (!mentor_info) return;
        return mentor_info.id;
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
exports.reject = async (reservation_id, is_reapply_available) => {
    // TODO: 최초예약, 반려, 재예약 등 예약 관련 로깅 작업
    let status = is_reapply_available ? 'REAPPLIED_REQUEST' : 'REJECTED';
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

        return await Reservation.findOne({
            attributes: [['user_id', 'user_id']],
            where: { id: reservation_id },
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 해당 멘토의 예약목록을 옵션별로, 추출하는 함수
 * @returns {Object}
 */
exports.getReservationsByOption = async (mentor_id, status) => {
    let where_option, attributes_option;

    if(status === 'wait') {
        where_option = {[Op.and]: [{ status: 'WAITING' }, { mentor_id: mentor_id }]};
        attributes_option = ['id', 'type', 'duration', 'start', 'proposed_start1', 'proposed_start2', 'proposed_start3', 'link', 'question', 'user_id'];
    } else if (status === 'confirm') {
        where_option = {[Op.and]: [{ status: 'CONFIRMED' }, { mentor_id: mentor_id }]};
        attributes_option = ['id', 'type', 'duration', 'start'];
    }

    return await Reservation.findAll({
        attributes: attributes_option,
        where: where_option
    });
};

/**
 * 해당 멘티 - 멘토의 예약 정보 반환하는 함수
 *
 * @param {*} user_id 멘티 id
 * @param {*} mentor_id 멘토 id
 * @returns
 */
exports.getReservationsForCheck = async (user_id, mentor_id) => {
    return await Reservation.findAll({ where: {[Op.and]: [{ user_id: user_id }, { mentor_id: mentor_id }, { status: 'WAITING'}]} });
};

/**
 *
 * 예약 데이터의 사용자 ID에 해당하는 사용자 이름을 가져오는 기능을 수행하는 함수
 *
 * @param {*} reservations 예약 데이터
 * @returns
 */
exports.addUsernamesByReservation = async (reservations) => {
    for (let data of reservations) {
        const result = await User.findAll({
            attributes: ['user_name'],
            where: { id: data.user_id }
        })
        const rows = result.map(item => item.toJSON());
        data.dataValues.user_name = rows[0]?.user_name || null;
    }

    return reservations;
}