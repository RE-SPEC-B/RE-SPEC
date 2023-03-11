'use strict';

const service = require('../services/portfolio');
const {
    reservationCreate
} = service;

const { success, fail } = require('../functions/responseStatus');
const { checkDuplicateDates } = require('../functions/common');

/**
 * 멘티가 멘토에게 포트폴리오 첨삭을 신청&예약하는 API입니다.
 * 
 * 프로세스)
 * 1. 신청한 유저(멘티), 멘토id, 진행시간, 1~3가지 제안시간, 포트폴리오 링크, 질문을 수집
 * 2. 예약시간이 1개 이상인지, 예약시간끼리 중복이 없는지 확인
 * 3. 이상 없다면 예약내용 저장
 */
exports.portfolioReserve = async (req, res) => {
    let { mentor_key, duration, proposed_start1, proposed_start2, proposed_start3, question, link } = req.body;
    let user_key = req.session.passport.user;

    if(!proposed_start1) return fail(res, 403, "More than one proposed reservation time is required.");
    if(!link) return fail(res, 403, "Portfolio link is required.");
    
    if(checkDuplicateDates(proposed_start1, proposed_start2, proposed_start3)) return fail(res, 403, "Reservation times cannot be the same.");

    try {
        await reservationCreate(user_key, mentor_key, duration, proposed_start1, proposed_start2, proposed_start3, question, link).
            then(() => {
                return success(res, 200, 'Portfolio Reservation success.');
            })
            .catch((err) => { return fail(res, 500, `${err}`); });
    } catch (error) {
        return fail(res, 500, `${err}`);
    }
}
