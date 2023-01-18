'use strict';

const service = require('../services/user');
const {
    userFindAndUpdate,
    jobFindAndInfoCreate,
    mentorInfoGet,
    userInfoPut
} = service;

const { success, fail } = require('../functions/responseStatus');

/**
 * 멘티에서 멘토를 등록하는 API입니다.
 * 
 * 프로세스)
 * 1. 유저명을 통한 해당 유저 포지션 변경 & 유저 ID 반환
 * 2. 반환된 유저 ID를 통하여, 해당 유저 Job, Career, Education 추가
 */
exports.mentorRegistration = async (req, res) => {
    let { job, company, companysize, career, university, education } = req.body;
    let username = req.session.sid;

    let user_id = await userFindAndUpdate(username);
    if(user_id === 0) return fail(res, 403, "You are already mentor.");

    let result = await jobFindAndInfoCreate(job, user_id, career, company, companysize, university, education);
    if(result === 'success.') {
        return success(res, 200, 'Mentor register success.');
    } else {
        return fail(res, 500, result);
    }
}

/**
 * 멘토정보를 가져오는 API입니다.
 */
exports.mentorInfo = async (req, res) => {
    const { id } = req.params;

    mentorInfoGet(id)
        .then((data) => {
            return success(res, 200, 'get mentor info', data);
        })
        .catch((err) => {
            return fail(res, 500, err);
        });
}

/**
 * 멘토정보를 가져오는 API입니다.
 */
exports.userInfo = async (req, res) => {
    let username = req.session.sid, profile;
    if(req.file) profile = req.file.location;

    userInfoPut(username, profile)
        .then((data) => {
            return success(res, 200, 'success update',data);
        })
        .catch((err) => {
            return fail(res, 500, err);
        });
}