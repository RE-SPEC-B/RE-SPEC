'use strict';

const { User, Job ,Career, Education } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;

/**
 * 유저명을 통하여, 해당 유저 포지션 변경 & 유저 ID를 반환합니다.
 * 이미 해당 유저가 멘토일 경우 0을 반환합니다.
 * 
 * @param {*} username 현재 로그인중인 사용자의 유저명
 * @returns 
 */
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

/**
 * 멘토로 갱신되는 멘티의 유저 ID를 받아, 해당 유저 Job, Career, Education 부분 추가
 * 
 * @param {*} job 생성할 해당 유저의 직업
 * @param {*} user_id 멘토로 갱신되는 멘티의 유저 ID
 * @param {*} career 생성할 해당 유저의 경력
 * @param {*} company 생성할 해당 유저의 기업 규모
 * @param {*} university 생성할 해당 유저의 대학교
 * @param {*} education 생성할 해당 유저의 학력
 * @returns 
 */
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