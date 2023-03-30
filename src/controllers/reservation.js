'use strict';

const reservation = require('../services/reservation');
const push = require('../services/push');

const { 
    reserve, 
    confirm, 
    checkWaitingReservation,
    validateMentor, 
    getMentorKey, 
    getReservationsByOption, 
    getReservationsForCheck,
    addUsernamesByReservation
} = reservation;

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
    if (!proposed_start1 && !proposed_start2 && !proposed_start3) return fail(res, 403, 'More than one proposed reservation time is required.');

    try {
        const is_valid_mentor = await validateMentor(user_key, mentor_key);
        if (!is_valid_mentor) return fail(res, 403, 'User must be different from mentor.');

        // 해당 멘티에 한정하여, 중복 예약 신청 검사
        const reservations = await getReservationsForCheck(user_key, mentor_key);
        
        const request_time = [proposed_start1, proposed_start2, proposed_start3]
            .filter(date => date !== undefined)
            .map(date => new Date(date).getTime());
        const requested_time = reservations.flatMap(reservation => [reservation.proposed_start1, reservation.proposed_start2, reservation.proposed_start3]
            .filter(date => date !== null)
            .map(date => date.getTime()));

        // 요청받았던 시간들 중에서 요청받은 현재 시간들을 중복검사
        for(let i = 0; i < request_time.length; i++) {
            if (requested_time.indexOf(request_time[i]) !== -1) {
                return fail(res, 400, 'Reservation times can not overlap.');
            }
        }

        await reserve(user_key, mentor_key, type, duration, proposed_start1, proposed_start2, proposed_start3, question, link)
            .then(async () => {
                user_data = await findUserFcm(0, mentor_key);
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
 * 1. 유저가 멘토가 맞는지, 유저에게 예약 대기 중인 예약이 맞는지 검증
 * 2. 이상 없다면, CONFIRMED된 해당 멘토의 예약 시간들과 확정 지으려는 예약시간이 겹치는지 검증
 * 3. 전부 통과 시, 해당 멘티에게 push alarm
 */
exports.confirmReservation = async (req, res) => {
    let { reservation_key, duration, start } = req.body;
    let user_key = req.session.passport.user;
    let user_name = req.session.sid;
    let user_data;

    try {
        const mentor_key = await getMentorKey(user_key);
        if (!mentor_key) return fail(res, 403, 'User is not a mentor.');
        
        const is_valid_reservation = await checkWaitingReservation(reservation_key, mentor_key);
        if (!is_valid_reservation) return fail(res, 403, 'Invalid Reservation.');

        const reservations = await getReservationsByOption(mentor_key, 'confirm');
        
        const new_range = [new Date(start), new Date(start.getTime() + (duration * 60000))]; // 비교 대상 시간 배열 생성
        const range = reservations.map(data => [new Date(data.start), new Date(data.start.getTime() + (data.duration * 60000))]);
        range.sort((a, b) => a[0] - b[0]); // 시작 시간을 기준으로 정렬

        // 확정 가능한 시간 판별
        let flag = false;
        for(let i = 0; i < range.length; i++) {
            if(i === 0 && range[i][0] >= new_range[1]) flag = true; // front
            else if(range[i + 1] && range[i][1] <= new_range[0] && range[i + 1][0] >= new_range[1]) flag = true; // middle
            else if(i === range.length - 1 && range[i][1] <= new_range[0]) flag = true; // back
            if(flag) break;
        }

        if(flag || !reservations[0]) {
            await confirm(reservation_key, start)
                .then(async (data) => {
                    user_data = await findUserFcm(data.userkey);
                    pushAlarm(user_data.fcm, `🍪 [RE:SPEC] 멘토링 확정!`, `${user_name}멘토와의 예약이 확정되셨습니다!`);
    
                    return success(res, 200, 'Reservation confirmed.');
                })
                .catch((err) => {
                    return fail(res, 500, `${err.message}`);
                });
        } else {
            return fail(res, 400, 'The time overlaps.');
        }
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};

/**
 * 옵션에 따른, 멘토의 예약 목록을 호출하는 API입니다.
 *
 * 프로세스)
 * 1. 멘토키, 예약값(wait, confirm)을 전달받습니다.
 * 2-1. 예약값이 wait이라면, 반환값에 username을 추가해 전달합니다.
 * 2-2. 예약값이 confirm이라면, 순수값을 전달합니다.
 */
exports.getListOfMentor = async (req, res) => {
    let { mentorkey, status } = req.params;

    try {
        await getReservationsByOption(mentorkey, status)
            .then(async (data) => {
                if(!data[0]) return fail(res, 404, 'There is no data.');

                if(status === 'wait') {
                    const wait_reservations = await addUsernamesByReservation(data);
                    return success(res, 200, 'Get reservations of mentor.', wait_reservations);
                } else {
                    return success(res, 200, 'Get reservations of mentor.', data);
                }
            })
            .catch((err) => {
                return fail(res, 500, err.message);
            });
    } catch (err) {
        return fail(res, 500, `${err.message}`);
    }
};
