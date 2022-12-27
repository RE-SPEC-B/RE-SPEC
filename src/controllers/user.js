'use strict';

const service = require('../services/user');
const {
    userFindAndUpdate,
    jobFindAndInfoCreate,
} = service;

const { success, fail } = require('../functions/responseStatus');

exports.mentorRegistration = async (req, res) => {
    let { job, company, career, university, education } = req.body;
    let username = req.session.sid;

    let user_id = await userFindAndUpdate(username);
    if(user_id === 0) return fail(res, 403, "You are already mentor.");

    let result = await jobFindAndInfoCreate(job, user_id, career, company, university, education);
    if(result === 'success.') {
        return success(res, 200, 'Mentor register success.');
    } else {
        return fail(res, 500, result);
    }
}
