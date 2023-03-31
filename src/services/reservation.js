'use strict';

const { User, Mentorinfo, Reservation } = require('../utils/connect');

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
    return await Mentorinfo.findOne({ where: { id: mentor_key } }).then((mentor_info) => {
        if (!mentor_info) throw new Error('Invalid Mentor!');
        return user_key != mentor_info.userkey;
    });
};

/**
 * 유저ID 정보을 바탕으로, 멘토ID를 반환하는 함수
 *
 * @param {*} user_key 멘토의 유저ID
 * @returns
 */
exports.getMentorKey = async (user_key) => {
    return await Mentorinfo.findOne({ where: { userkey: user_key } }).then((mentor_info) => {
        if (!mentor_info) return;
        return mentor_info.id;
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
        return await Reservation.findOne({
            where: { id: reservation_key },
        })
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 해당 멘토의 예약목록을 옵션별로, 추출하는 함수
 * @returns {Object}
 */
exports.getReservationsByOption = async (mentor_key, status) => {
    let where_option, attributes_option;

    if(status === 'wait') {
        where_option = {[Op.and]: [{ status: 'WAITING' }, { mentorkey: mentor_key }]};
        attributes_option = ['id', 'type', 'duration', 'start', 'proposed_start1', 'proposed_start2', 'proposed_start3', 'link', 'question', 'userkey'];
    } else if (status === 'confirm') {
        where_option = {[Op.and]: [{ status: 'CONFIRMED' }, { mentorkey: mentor_key }]};
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
 * @param {*} user_key 멘티 id
 * @param {*} mentor_key 멘토 id
 * @returns 
 */
exports.getReservationsForCheck = async (user_key, mentor_key) => {
    return await Reservation.findAll({ where: {[Op.and]: [{ userkey: user_key }, { mentorkey: mentor_key }, { status: 'WAITING'}]} });
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
            attributes: ['username'],
            where: { id: data.userkey }
        })
        const rows = result.map(item => item.toJSON());
        data.dataValues.username = rows[0]?.username || null;
    }
    
    return reservations;
}