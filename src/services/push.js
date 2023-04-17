'use strict';

const { User, Mentorinfo } = require('../utils/connect');

const { Op, fn, col } = require('sequelize');

const _admin = require('firebase-admin');

/**
 *
 * FCM을 사용하여 해당 사용자에게 푸시 알림을 보내는 함수
 *
 * @param {*} fcm 알람을 받을 유저의 fcm
 * @param {*} title 알람 제목
 * @param {*} body 알람 내용
 * @returns
 */
exports.pushAlarm = (fcm, title, body) => {
    try {
        let time = new Date();
        let now = time.toLocaleString(); // 앱 내 자체 시간이 보이겠지만, 지금은 test용도로 남겨뒀습니다.

        let message = {
            notification: {
                title: title,
                body: `${body} ${now}`,
            },
            token: fcm,
        };

        _admin.messaging().send(message);

        return;
    } catch (err) {
        return new Error(err);
    }
};

/**
 *
 * 어느 유저의 FCM 토큰 정보를 찾습니다.
 * Ex) findUserFcm(0, mentoy_id)을 요청하면, 해당 멘토의 FCM 토큰 정보를 반환합니다.
 * Ex) findUserFcm(user_id, 0)을 요청하면, 해당 유저의 FCM 토큰 정보를 반환합니다.
 *
 * @param {*} user_id FCM 토큰 정보를 찾을 user id
 * @param {*} mentor_id FCM 토큰 정보를 찾을 mentor id
 * @returns
 */
exports.findUserFcm = async (user_id, mentor_id) => {
    try {
        let user_data;

        if (user_id == 0) { // find mentor's user id
            user_data = await Mentorinfo.findOne({
                attributes: ['user_id'],
                where: { id: mentor_id },
            });

            return User.findOne({
                attributes: ['fcm'],
                where: { id: user_data.user_id },
            });
        } else { // finc user's user id
            return User.findOne({
                attributes: ['fcm'],
                where: { id: user_id },
            });
        }
    } catch (err) {
        return new Error(err);
    }
};
