'use strict';

const service = require('../services/reservation');
const push = require('../services/push');

const { reserve, checkWaitingReservation, validateMentor } = service;
const { pushAlarm, findUserFcm } = push;

const { success, fail } = require('../functions/responseStatus');

/**
 * 멘티가 멘토에게 멘토링 또는 포트폴리오 첨삭을 예약하는 API입니다.
 *
 * 프로세스)
 * 1. 신청한 유저(멘티), 멘토id, 진행시간, 1~3가지 제안시간, 질문을 수집
 * 2. 예약시간이 1개 이상인지, 예약시간끼리 중복이 없는지 확인
 * 3. 유효한 멘토 정보인지, 유저와 멘토가 일치하지 않는지 확인
 * 4. 이상 없다면 해당 멘토에게 push 알람보낸뒤, 예약내용 저장
 */
exports.createReservation = async (req, res) => {
    let { mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link } = req.body;
    let user_key = req.session.passport.user;
    let user_name = req.session.sid;
    let user_data;

    if (type == 'PT' && !link) return fail(res, 403, 'Portfolio link is required.');
    if (duration < 10) return fail(res, 403, 'Duration must be more than 10.');

    const isValidMentor = await validateMentor(user_key, mentor_key);
    if (!isValidMentor) return fail(res, 403, 'User must be different from mentor');

    try {
        user_data = await findUserFcm(0, mentor_key);
        
        await reserve(user_key, mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link)
            .then(() => {
                pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘티 예약 신청!`, `${user_name}가 ${type == 'MT' ? '멘토링' : '포트폴리오 첨삭'}을 신청했습니다!`);

                return success(res, 200, 'Mentoring Reservation success.');
            })
            .catch((error) => {
                return fail(res, 500, `${error}`);
            });
    } catch (error) {
        return fail(res, 500, `${error}`);
    }
};

exports.confirmReservation = async (req, res) => {
    let { reservation_key, start } = req.body;
    let user_key = req.session.passport.user;

    try {
        const isValidReservation = await checkWaitingReservation(reservation_key, user_key);
        if (!isValidReservation) return fail(res, 403, 'Invalid Reservation');

        return success(res, 200, 'Valid Reservation');
    } catch (error) {
        return fail(res, 500, `${error}`);
    }
};
