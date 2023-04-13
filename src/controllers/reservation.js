'use strict';

const service = require('../services/reservation');
const push = require('../services/push');

const { reserve, confirm, reject, checkWaitingReservation, validateMentor, getMentorId, getReservationsOfMentor } = service;
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
    let { mentor_id, proposed_start1, proposed_start2, proposed_start3, type, duration, question, link } = req.body;
    let user_id = req.session.passport.user;
    let user_name = req.session.sid;
    let user_data;

    if (type == 'PT' && !link) return fail(res, 403, 'Portfolio link is required.');
    if (duration < 10) return fail(res, 403, 'Duration must be more than 10.');

    try {
        const isValidMentor = await validateMentor(user_id, mentor_id);
        if (!isValidMentor) return fail(res, 403, 'User must be different from mentor');

        await reserve(user_id, mentor_id, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link)
            .then(async () => {
                user_data = await findUserFcm(0, mentor_id);
                pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘티 예약 신청!`, `${user_name}가 ${type == 'MT' ? '멘토링' : '포트폴리오 첨삭'}을 신청했습니다!`);

                return success(res, 200, 'Mentoring Reservation success.');
            })
            .catch((err) => {
                return fail(res, 500, `${err.message}`);
            });
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};

/**
 * 멘토가 멘토링 또는 포트폴리오 예약을 확정하는 API입니다.
 *
 * 프로세스)
 * 1. 유저가 멘토가 맞는지,
 *    유저에게 예약대기중인 예약이 맞는지,
 *    예약 가능한 시간인지 검증
 * 2. 검증이 이상 없다면 예약 확정
 */
exports.confirmReservation = async (req, res) => {
    let reservation_id = req.params.reservation_id;
    let { start } = req.body;
    let user_id = req.session.passport.user;
    let user_name = req.session.sid;
    let user_data;

    //예약시간은 현 시간보다 미래여야함
    if (start < new Date()) return fail(res, 403, 'Start time must be future.');

    try {
        const mentor_id = await getMentorId(user_id);
        if (!mentor_id) return fail(res, 403, 'User is not a mentor');

        const isValidReservation = await checkWaitingReservation(reservation_id, mentor_id);
        if (!isValidReservation) return fail(res, 403, 'Invalid Reservation');

        await confirm(reservation_id, start)
            .then(async (data) => {
                user_data = await findUserFcm(data.user_id);
                pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘토링 확정!`, `${user_name}멘토와의 예약이 확정되셨습니다!`);

                return success(res, 200, 'Reservation confirmed.');
            })
            .catch((err) => {
                return fail(res, 500, `${err.message}`);
            });
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};

/**
 * 멘토가 멘토링 또는 포트폴리오 예약을 거절하는 API입니다.
 *
 * 프로세스)
 * 1. 유저가 멘토가 맞는지, 유저에게 예약대기중인 예약이 맞는지 검증
 * 2. 검증이 이상 없다면 재신청 여부 고려하여 예약 거절
 */
exports.rejectReservation = async (req, res) => {
    let reservation_id = req.params.reservation_id;
    let is_reapply_available = req.body.is_reapply_available;
    let user_id = req.session.passport.user;
    let user_name = req.session.sid;
    let user_data;

    try {
        const mentor_id = await getMentorId(user_id);
        if (!mentor_id) return fail(res, 403, 'User is not a mentor');

        const is_valid_reservation = await checkWaitingReservation(reservation_id, mentor_id);
        if (!is_valid_reservation) return fail(res, 403, 'Invalid Reservation');

        await reject(reservation_id, is_reapply_available)
            .then(async (data) => {
                user_data = await findUserFcm(data.user_id);
                if (is_reapply_available) {
                    pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘토링 거절!`, `${user_name}멘토와의 예약이 반려되셨습니다!`);
                } else {
                    pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘토링 재신청 요청!`, `${user_name}멘토와의 예약이 해당 시간에 불가합니다! 다른 시간대로 재신청 해주세요!`);
                }

                return success(res, 200, is_reapply_available ? 'Reservation reapplication requested.' : 'Reservation rejected.');
            })
            .catch((err) => {
                return fail(res, 500, `${err.message}`);
            });
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};

/**
 * 멘토의 예약 목록을 호출하는 API입니다.
 *
 * 프로세스)
 * 1. 유저가 멘토가 맞는지 검증
 * 2. 검증이 이상 없다면 멘토에게 예약된 모든 예약 가져옴
 */
exports.getListOfMentor = async (req, res) => {
    let mentor_id = req.params.mentor_id;

    try {
        await getReservationsOfMentor(mentor_id)
            .then((data) => {
                if (!data[0]) return fail(res, 404, 'There is no data.');
                return success(res, 200, 'Get reservations of mentor.', data);
            })
            .catch((err) => {
                return fail(res, 500, err.message);
            });
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};
