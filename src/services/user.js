'use strict';

const { User, Job ,Career, Education } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;

exports.userFindAndUpdate = (username) => {
    return User.findOne({
        attributes: ['id', 'position'],
        where: { username: username },
    }).then(async(user_data) => {
        if(user_data.position === 'mentor') return 0;
        await User.update({ position: 'mentor' }, {
            where: { id: user_data.id },
        });

        return user_data.id;
    })
}

exports.jobFindAndInfoCreate = async (job, user_id, career, company, university, education) => {
    let job_data = await Job.findOne({
        attributes: ['id'],
        where: { job: job },
    })
    
    user_job.create({
        UserId: user_id,
        JobId: job_data.id,
    }).then(() => {
        Career.create({
            career: career,
            company: company,
            userkey: user_id,
        })

        Education.create({
            university: university,
            education: education,
            userkey: user_id,
        })
    }).catch(err => {
        return err
    });
    
    return 'success.';
}