'use strict';

// const service = require('../services/menu');
// const { } = service;

const { User, Job ,Career, Education } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;

const { success, fail } = require('../functions/responseStatus');

exports.mentorRegistration = async (req, res) => {
    let { job, company, career, university, education } = req.body;
    let username = req.session.sid;

    let user_data = await User.findOne({
        attributes: ['id'],
        where: { username: username },
    })
    await User.update({ position: 'mentor' }, {
        where: { id: user_data.id },
    });

    let job_data = await Job.findOne({
        attributes: ['id'],
        where: { job: job },
    })
    
    user_job.create({
        UserId: user_data.id,
        JobId: job_data.id,
    }).then(() => {
        Career.create({
            career: career,
            company: company,
            userkey: user_data.id,
        })

        Education.create({
            university: university,
            education: education,
            userkey: user_data.id,
        }).then(() => { return success(res, 200, 'success.'); })
    }).catch(err => {
        return fail(res, 500, err);
    });
}
