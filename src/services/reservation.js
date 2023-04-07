'use strict';

const { Mentorinfo, Reservation, LogReservation } = require('../utils/connect');

const { checkDuplicateDates } = require('../functions/common');

const { Op, fn, col, Transaction } = require('sequelize');
const { sequelize } = require('../utils/connect');

/**
 * 고객 ID, 멘토 ID, 예약정보를 받아 저장합니다.
 * 포트폴리오(PT) 예약일 경우 링크도 함께 저장합니다.
 *
 * @param {number} userKey 예약을 생성하는 유저. 멘티의 ID
 * @param {number} mentorKey 예약을 신청받는 멘토의 ID
 * @param {string} type 예약 타입. 멘토링MT 또는 포트폴리오 첨삭PT
 * @param {number} duration 신청하는 예약의 진행시간
 * @param {Date} proposedStart1 신청하는 예약의 첫번째 제안시간
 * @param {Date} proposedStart2 신청하는 예약의 두번째 제안시간
 * @param {Date} proposedStart3 신청하는 예약의 세번째 제안시간
 * @param {string} question 멘토에게 보내는 질문
 * @param {string} link 포트폴리오 링크(포트폴리오 첨삭 신청 시 수집)
 * @returns
 */
exports.reserve = async (userKey, mentorKey, type, duration, proposedStart1, proposedStart2, proposedStart3, question, link) => {
    if (await checkDuplicateDates(proposedStart1, proposedStart2, proposedStart3)) {
        throw new Error('Reservation times cannot be the same.');
    }

    const transaction = await sequelize.transaction();
    try {
        const reservation = await Reservation.create({
                type: type == 'MT' ? 'MT' : 'PT',
                duration: duration,
                status: 'WAITING',
                proposed_start1: proposedStart1,
                proposed_start2: proposedStart2,
                proposed_start3: proposedStart3,
                question: question,
                link: type == 'PT' ? link : '',
                userkey: userKey,
                mentorkey: mentorKey,
            },
            { transaction: transaction },
        );
        // 예약 로그 기록
        const logReservationData = { reservation_key: reservation.id, status_from: '', status_to: 'WAITING' };
        await LogReservation.create(logReservationData, { transaction: transaction });
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
 * @param {*} mentorKey 예약을 신청받는 멘토의 ID
 * @returns boolean 예약 검증 결과
 */
exports.validateMentor = async (userKey, mentorKey) => {
    return await Mentorinfo.findOne({ where: { id: mentorKey } }).then((mentorInfo) => {
        if (!mentorInfo) throw new Error('Invalid Mentor!');
        return userKey != mentorInfo.userkey;
    });
};

/**
 * 유저ID 정보을 바탕으로, 멘토ID를 반환하는 함수
 *
 * @param {*} userKey 멘토의 유저ID
 * @returns
 */
exports.getMentorKey = async (userKey) => {
    return await Mentorinfo.findOne({ where: { userkey: userKey } }).then((mentorInfo) => {
        if (!mentorInfo) return;
        return mentorInfo.id;
    });
};

/**
 * 예약 키 정보을 바탕으로, 멘토에게 예약된 정보가 맞는지
 * 확인하고 반환하는 함수
 *
 * @param {*} reservationKey 예약 ID
 * @param {*} mentorKey 멘토 ID
 * @returns
 */
exports.checkWaitingReservation = async (reservationKey, mentorKey) => {
    console.log("일단 왔고");
    console.log(reservationKey, mentorKey);
    return await Reservation.findOne({
        where: { status: 'WAITING', id: reservationKey, mentorkey: mentorKey },
    });
};

/**
 * 예약 키, 시작 시간 정보을 바탕으로
 * 예약을 확정하는 함수
 * @param {*} reservationKey 예약 ID
 * @param {*} start 확정된 멘토링 시작 시간
 * @returns
 */
exports.confirm = async (reservationKey, start) => {
    // TODO: 확정 시간이 반드시 제안 시간 중 하나여야 한다는 정책이 없기때문에 정책이 명확해지면 작업할 예정
    const now = new Date();

    const transaction = await sequelize.transaction();

    console.log(reservationKey);
    try {
        await Reservation.update(
            { status: 'CONFIRMED', start: start, updatedAt: now },
            { where: { id: reservationKey } },
            { transaction: transaction },
        );
        // 예약 로그 기록
        const logReservationData = { reservation_key: reservationKey, status_from: 'WAITING', status_to: 'CONFIRMED' };
        await LogReservation.create(logReservationData, { transaction: transaction });
        await transaction.commit();

        // 참고: CONFIRMED 업데이트 이후, 해당 멘티에게 알림을 보내기위해, FCM정보가 필요합니다.
        // 따라서, 아래 코드를 삽입했고 작업하실땐, 지우셔도 됩니다.
        return await Reservation.findOne({
            where: { id: reservationKey },
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 재신청 여부를 적용하여
 * 예약을 반려하는 함수
 * @param {*} reservationKey 예약 ID
 * @param {*} start 확정된 멘토링 시작 시간
 * @returns
 */
exports.reject = async (reservationKey, isReapplyAvailable) => {
    // TODO: 최초예약, 반려, 재예약 등 예약 관련 로깅 작업
    let status = isReapplyAvailable ? 'REAPPLIED_REQUEST' : 'REJECTED';
    const transaction = await sequelize.transaction();

    try {
        await Reservation.update({ status: status }, { where: { id: reservationKey } }, { transaction: transaction });
        // 예약 로그 기록
        const logReservationData = { reservation_Key: reservationKey, status_from: 'WAITING', status_to: status };
        await LogReservation.create(logReservationData, { transaction: transaction });
        await transaction.commit();

        // 참고: CONFIRMED 업데이트 이후, 해당 멘티에게 알림을 보내기위해, FCM정보가 필요합니다.
        // 따라서, 아래 코드를 삽입했고 작업하실땐, 지우셔도 됩니다.
        return await Reservation.findOne({
            attributes: [['userkey', 'userKey']],
            where: { id: reservationKey },
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 해당 멘토의 예약이 확정된 목록을 추출하는 함수
 * @returns {Object}
 */
exports.getReservationsOfMentor = async (mentorkey) => {
    return await Reservation.findAll({
        attributes: ['id', 'type', 'status', 'duration', 'start'],
        where: {[Op.and]: [{ status: 'CONFIRMED' }, { mentorkey: mentorkey }]}
    });
};
