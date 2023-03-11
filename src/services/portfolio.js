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

const { Op, fn, col } = require('sequelize');

/**
 * 고객 ID, 멘토 ID, 예약정보를 받아 저장
 * 
 * @param {*} username 현재 로그인중인 사용자의 유저명
 * @returns 
 */
exports.reservationCreate = async ( user_key, mentor_key, duration, proposed_start1, proposed_start2, proposed_start3, question, link ) => {
    try {
        let result = await reservation.create({
            type: 'PT',
            duration: duration,
            proposed_start1: proposed_start1,
            proposed_start2: proposed_start2,
            proposed_start3: proposed_start3,
            question: question,
            link: link,
            userkey: user_key,
            mentorkey: mentor_key,
        })
        return result;
    } catch (err) {
        throw new Error(err);
    }
}
