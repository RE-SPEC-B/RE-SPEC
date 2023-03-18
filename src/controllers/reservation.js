'use strict';

const service = require('../services/reservation');
const { reserve } = service;

const { success, fail } = require('../functions/responseStatus');

/**
 * 멘티가 멘토에게 멘토링 또는 포트폴리오 첨삭을 예약하는 API입니다.
 *
 * 프로세스)
 * 1. 신청한 유저(멘티), 멘토id, 진행시간, 1~3가지 제안시간, 질문을 수집
 * 2. 예약시간이 1개 이상인지, 예약시간끼리 중복이 없는지 확인
 * 3. 이상 없다면 예약내용 저장
 */
exports.createReservation = async (req, res) => {
    let { mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link } = req.body;
    let user_key = req.session.passport.user;

    if (type == 'PT' && !link) return fail(res, 403, 'Portfolio link is required.');

    try {
        await reserve(user_key, mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link)
            .then(() => {
                return success(res, 200, 'Mentoring Reservation success.');
            })
            .catch((err) => {
                return fail(res, 500, `${err.message}`);
            });
    } catch (error) {
        return fail(res, 500, `${error}`);
    }
};
