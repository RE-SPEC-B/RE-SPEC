'use strict';

const { 
    User, 
    Job, 
    Characteristic, 
    Education, 
    Career, 
    Mentorinfo, 
    Mentorreview, 
    Mentorcareer, 
    Mentorstrength, 
    Mentorproduct,
    Portfolio, 
    Portfoliopreview, 
    Portfoliorecommendation, 
    Portfolioprogress, 
    Mentorevaluation,
    Reservation
} = require('../utils/connect');

const model = require('../utils/connect');
const reservation = require('../models/reservation');
const { checkDuplicateDates, isValidReservationType } = require('../functions/common');

const { Op, fn, col } = require('sequelize');

/**
 * 고객 ID, 멘토 ID, 예약정보를 받아 저장합니다.
 * 포트폴리오(PT) 예약일 경우 링크도 함께 저장합니다.
 *
 * @param {*} user_key 예약을 생성하는 유저. 멘티의 ID
 * @param {*} mentor_key 예약을 신청받는 멘토의 ID
 * @param {*} type 예약 타입. 멘토링MT 또는 포트폴리오 첨삭PT
 * @param {*} duration 신청하는 예약의 진행시간
 * @param {*} proposed_start1 신청하는 예약의 첫번째 제안시간
 * @param {*} proposed_start2 신청하는 예약의 두번째 제안시간
 * @param {*} proposed_start3 신청하는 예약의 세번째 제안시간
 * @param {*} question 멘토에게 보내는 질문
 * @param {*} link 포트폴리오 링크(포트폴리오 첨삭 신청 시 수집)
 * @returns
 */
exports.reserve = async (user_key, mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link) => {
    if (checkDuplicateDates(proposed_start1, proposed_start2, proposed_start3)) {
        throw new Error('Reservation times cannot be the same.');
    }

    if (!isValidReservationType(type)) {
        throw new Error('Type must be MT or PT.');
    }

    try {
        let result = await reservation.create({
            type: type == 'MT' ? 'MT' : 'PT',
            duration: duration,
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
