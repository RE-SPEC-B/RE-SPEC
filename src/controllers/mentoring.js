'use strict';

const service = require('../services/mentoring');
const {
    reservationCreate
} = service;

const { success, fail } = require('../functions/responseStatus');

/**
 * 멘티가 멘토링을 신청&예약하는 API입니다.
 * 
 * 프로세스)
 * 1. 신청한 유저(멘티), 멘토id, 1~3가지 제안시간을 받아 예약 정보 저장
 * 2. 멘토링 예약이 아닌 포트폴리오 예약의 경우  포트폴리오 링크 추가로 수집한다.
 */
exports.mentoringReserve = async (req, res) => {
    let { mentor_key, duration, proposed_start1, proposed_start2, proposed_start3, question } = req.body;
    let user_key = req.session.passport.user;

    try {
        await reservationCreate(user_key, mentor_key, duration, proposed_start1, proposed_start2, proposed_start3, question).
            then(() => {
                return success(res, 200, 'Mentor Reserve success.');
            })
            .catch((err) => { return fail(res, 500, `${err}`); });
    } catch (error) {
        return fail(res, 500, `${err}`);
    }
}
