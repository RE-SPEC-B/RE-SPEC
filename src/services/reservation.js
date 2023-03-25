'use strict';

const { Mentorinfo, Reservation } = require('../utils/connect');

const { checkDuplicateDates } = require('../functions/common');

const { Op, fn, col } = require('sequelize');

/**
 * 고객 ID, 멘토 ID, 예약정보를 받아 저장합니다.
 * 포트폴리오(PT) 예약일 경우 링크도 함께 저장합니다.
 *
 * @param {number} user_key 예약을 생성하는 유저. 멘티의 ID
 * @param {number} mentor_key 예약을 신청받는 멘토의 ID
 * @param {string} type 예약 타입. 멘토링MT 또는 포트폴리오 첨삭PT
 * @param {number} duration 신청하는 예약의 진행시간
 * @param {Date} proposed_start1 신청하는 예약의 첫번째 제안시간
 * @param {Date} proposed_start2 신청하는 예약의 두번째 제안시간
 * @param {Date} proposed_start3 신청하는 예약의 세번째 제안시간
 * @param {string} question 멘토에게 보내는 질문
 * @param {string} link 포트폴리오 링크(포트폴리오 첨삭 신청 시 수집)
 * @returns
 */
exports.reserve = async (user_key, mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link) => {
    if (await checkDuplicateDates(proposed_start1, proposed_start2, proposed_start3)) {
        throw new Error('Reservation times cannot be the same.');
    }

    try {
        let result = await Reservation.create({
            type: type == 'MT' ? 'MT' : 'PT',
            duration: duration,
            status: 'WAITING',
            proposed_start1: proposed_start1,
            proposed_start2: proposed_start2,
            proposed_start3: proposed_start3,
            question: question,
            link: type == 'PT' ? link : '',
            userkey: user_key,
            mentorkey: mentor_key,
        });

        return result;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 멘토의 ID를 바탕으로 멘토 정보와 신청 유저와 일치하는지 확인해서
 * 예약 가능한 멘토인지 검증 함수
 *
 * @param {*} mentor_key 예약을 신청받는 멘토의 ID
 * @returns boolean 예약 검증 결과
 */
exports.validateMentor = async (user_key, mentor_key) => {
    return await Mentorinfo.findOne({ where: { id: mentor_key } }).then((mentorInfo) => {
        if (!mentorInfo) throw new Error('Invalid Mentor!');
        return user_key != mentorInfo.userkey;
    });
};

/**
 * 유저ID 정보을 바탕으로, 멘토ID를 반환하는 함수
 *
 * @param {*} user_key 멘토의 유저ID
 * @returns
 */
exports.getMentorKey = async (user_key) => {
    return await Mentorinfo.findOne({ where: { userkey: user_key } }).then((mentorInfo) => {
        if (!mentorInfo) return;
        return mentorInfo.id;
    });
};

/**
 * 예약 키 정보을 바탕으로, 멘토에게 예약된 정보가 맞는지
 * 확인하고 반환하는 함수
 *
 * @param {*} reservation_key 예약 ID
 * @param {*} mentor_key 멘토 ID
 * @returns
 */
exports.checkWaitingReservation = async (reservation_key, mentor_key) => {
    return await Reservation.findOne({
        where: { status: 'WAITING', id: reservation_key, mentorkey: mentor_key },
    });
};

/**
 * 예약 키, 시작 시간 정보을 바탕으로
 * 예약을 확정하는 함수
 * @param {*} reservation_key 예약 ID
 * @param {*} start 확정된 멘토링 시작 시간
 * @returns
 */
exports.confirm = async (reservation_key, start) => {
    // TODO: 확정 시간이 반드시 제안 시간 중 하나여야 한다는 정책이 없기때문에 정책이 명확해지면 작업할 예정
    try {
        const now = new Date();
        await Reservation.update(
            { status: 'CONFIRMED', start: start, updatedAt: now },
            { where: { id: reservation_key } },
        );

        // 참고: CONFIRMED 업데이트 이후, 해당 멘티에게 알림을 보내기위해, FCM정보가 필요합니다.
        // 따라서, 아래 코드를 삽입했고 작업하실땐, 지우셔도 됩니다.
        return await Reservation.findOne({
            where: { id: reservation_key },
        })
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 멘토 키 정보을 바탕으로
 * 예약을 목록을 추출하는 함수
 * @param {*} mentor_key 멘토 ID
 * @returns {Object}
 */
exports.getReservationsOfMentor = async (mentor_key) => {
    return await Reservation.findAll({ where: { mentorkey: mentor_key } });
};
