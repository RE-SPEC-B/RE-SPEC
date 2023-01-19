'use strict';

const { User, Job, Characteristic, Education, Career, Mentorinfo, Mentorreview, Mentorcareer, Mentorstrength, Portfolio, Portfoliopreview, Portfoliorecommendation, Portfolioprogress } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;

const { Op, fn, col } = require('sequelize');

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
 * @param {*} company 생성할 해당 유저의 기업 이름
 * @param {*} companysize 생성할 해당 유저의 기업 규모
 * @param {*} university 생성할 해당 유저의 대학교
 * @param {*} education 생성할 해당 유저의 학력
 * @returns 
 */
exports.jobFindAndInfoCreate = async (job, user_id, career, company, companysize, university, education) => {
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
            companysize: companysize,
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

/**
 * 
 * @param {*} id 멘토인 해당 유저의 id
 * @returns 
 */
exports.mentorInfoGet = async (id) => {
    let review_count = await Mentorinfo.findOne({ where: {'userkey': id} })
    .then((mentor) => {
        return Mentorreview.count({ where: {'mentorkey': mentor.id} })
    });

    let user_data = await User.findAll({
        include: [
            {
                model: Career,
                required: false,
                attributes: ['company', 'career'],
            },
            {
                model: Characteristic,
                attributes: ['characteristic'],
                required: false,
                through: { attributes: [] }
            },
            {
                model: Job,
                attributes: ['job'],
                required: false,
                through: { attributes: [] }
            },
            {
                model: Mentorinfo,
                attributes: ['introduction', 'mentoring', 'correcting', 'satisfaction', 'video', 'title'],
                required: false,
                include: [
                    {
                        model: Mentorreview,
                        attributes: [],
                    },
                    {
                        model: Portfolio,
                        attributes: ['url', 'announcement'],
                        include: [
                            {
                                model: Portfoliopreview,
                                attributes: ['preview'],
                            },
                            {
                                model: Portfoliorecommendation,
                                attributes: ['recommendation'],
                            },
                            {
                                model: Portfolioprogress,
                                attributes: ['progress'],
                            }
                        ],
                    },
                    {
                        model: Mentorcareer,
                        attributes: ['companyname', 'company', 'job', 'start', 'end'],
                    },
                    {
                        model: Mentorstrength,
                        attributes: ['strength'],
                    }
                ],
            },
        ],
        attributes: ['id', 'username', 'profile'],
        where: { [Op.and]: [{ position: 'mentor' }, { id: id }] },
    })

    user_data.push({"reviews": review_count});
    return user_data;
}


// username 현재 로그인중인 사용자의 유저명
// exports.userInfoPut = (username, profile) => {
//     return User.update({
//         profile: profile,
//     }, {
//         where: { username: username },
//     });
// }