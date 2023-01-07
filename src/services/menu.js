'use strict';

const { User, Job, Characteristic, Education, Career, Mentorinfo, Mentorreview } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;
const user_characteristic = model.sequelize.models.user_characteristic;

const { Op } = require('sequelize');

/**
 * 사용자로부터 입력받은 쿼리 속 키들의 값들을 리턴하는 함수
 *
 * @param {*} keywords 사용자로부터 입력받은 쿼리
 * @param {*} keys 쿼리 속 키값 들
 * @returns
 */
exports.parseValue = (keywords, keys) => {
    let value = [];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        value.push(keywords[key].split(','));
    }
    return value;
};

/**
 * key 값과 key의 value 값들을 파싱 하여, 받은 key에 대해서만,
 * sql where 절을 생성하는 함수
 *
 * @param {*} a education, university, company, career
 * @param {*} b education, university, company, career
 * @param {*} ids job && a && b 기준으로 필터링 된 유저 id들
 * @param {*} value 사용자로부터 입력받은 key들의 value 값들
 * @param {*} keys 사용자로부터 입력받은 key 값들
 * @returns
 */
exports.keySelectWhere = (a, b, ids, value, keys) => {
    let where_arr = [{ userkey: { [Op.or]: ids } }];
    let type = [];
    for (let key of keys) if (key === a || key === b) type.push(key);
    for (let idx = 0; idx < type.length; idx++) {
        where_arr.push({ [type[idx]]: { [Op.or]: value[keys.indexOf(type[idx])] } });
    }
    return { [Op.and]: where_arr };
};

/**
 * 필터링 후, 공통되는 id에 관해 ids를 만드는 함수
 *
 * @param {*} id 필터링 후, 공통된 id
 * @returns
 */
exports.parseIds = (id) => {
    if (id !== undefined) {
        let ids = []; // 다음 for 문에서 공통된 부분에 대해서만 넣어하기 때문에 []
        for (let idx = 0; idx < id.length; idx++) ids.push(id[idx].id);
        return ids;
    } else return []; // job을 받고서, 서로 공통된 부분이 없다는 것 = ids 제거
};

/**
 * 상단 메뉴에서 검색어를 입력받아, 검색어와 유사한 직업 이름을 가져와
 * 그중, 그 직업을 가지는 유저들 출력
 *
 * @param {*} word 상단 메뉴의 단일 검색어
 * @returns
 */
exports.jobUserFindT = async (word) => {
    return await Job.findOne({
        attributes: ['id'],
        where: { job: { [Op.like]: '%' + word + '%' } },
    })
        .then(async (data) => {
            if (data === null) return;

            return await user_job
                .findAll({
                    attributes: ['UserId'],
                    where: { JobId: data.id },
                })
                .catch((err) => {
                    return res.status(500).json({ err });
                });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

/**
 * 해당하는 job을 가지는 user id를 리턴하는 함수
 *
 * @param {*} value 사용자로부터 입력받은 key들의 value 값들
 * @param {*} keys 사용자로부터 입력받은 key 값들
 * @returns
 */
exports.jobUserFindB = async (value, keys) => {
    return await Job.findAll({
        attributes: ['id'],
        where: { job: { [Op.or]: value[keys.indexOf('job')] } },
    })
        .then(async (data) => {
            let job_id = [];
            for (let x = 0; x < data.length; x++) job_id.push(data[x].id);

            return await user_job
                .findAll({
                    attributes: ['UserId'],
                    where: { JobId: { [Op.or]: job_id } },
                })
                .catch((err) => {
                    return res.status(500).json({ err });
                });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

/**
 * 상단 메뉴에서 검색어를 입력받아, 검색어와 유사한 characteristic을 가져와
 * 그중, 그 characteristic을 가지는 유저들 출력
 *
 * @param {*} word 상단 메뉴의 단일 검색어
 * @returns
 */
exports.characteristicUserFind = async (word) => {
    return await Characteristic.findOne({
        attributes: ['id'],
        where: { characteristic: { [Op.like]: '%' + word + '%' } },
    })
        .then(async (data) => {
            if (data === null) return;

            return await user_characteristic
                .findAll({
                    attributes: ['UserId'],
                    where: { CharacteristicId: data.id },
                })
                .catch((err) => {
                    return res.status(500).json({ err });
                });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

/**
 * 상단 메뉴에서 검색어를 입력받아, 검색어와 유사한 MBTI를 가져와
 * 그중, 그 MBTI를 가지는 유저들 출력
 *
 * @param {*} word 상단 메뉴의 단일 검색어
 * @returns
 */
exports.mbtiUserFind = async (word) => {
    return await User.findAll({
        attributes: ['id'],
        where: { mbti: word },
    }).catch((err) => {
        return res.status(500).json({ err });
    });
};

/**
 * 해당하는 education or university를 가지는 user id를 리턴하는 함수
 *
 * @param {*} where_education education 전용 where절 삽입
 * @returns
 */
exports.educationUserFind = async (where_education) => {
    return await Education.findAll({
        attributes: ['userkey'],
        where: where_education,
    })
        .then(async (data) => {
            if (data.length === 0) return; // 데이터가 없을때, userkey에 접근하면 오류

            let education_id = [];
            for (let x = 0; x < data.length; x++) education_id.push(data[x].userkey);

            return await User.findAll({
                attributes: ['id'],
                where: { id: { [Op.or]: education_id } },
            }).catch((err) => {
                return res.status(500).json({ err });
            });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

/**
 * 해당하는 company or career를 가지는 user id를 리턴하는 함수
 *
 * @param {*} where_career career 전용 where절 삽입
 * @returns
 */
exports.careerUserFind = async (where_career) => {
    return await Career.findAll({
        attributes: ['userkey'],
        where: where_career,
    })
        .then(async (data) => {
            if (data.length === 0) return;

            let career_id = [];
            for (let x = 0; x < data.length; x++) career_id.push(data[x].userkey);

            return await User.findAll({
                attributes: ['id'],
                where: { id: { [Op.or]: career_id } },
            }).catch((err) => {
                return res.status(500).json({ err });
            });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

/**
 * 필터링 된 유저 id들을 받아, 중복 요소 제거 후,
 * 그중 멘토인 유저를 출력하는 함수
 *
 * @param {*} ids 중복 요소가 제거된 필터링 후 유저 id들
 * @returns
 */
exports.userMentoFilter = (ids) => {
    return User.findAndCountAll({
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
                attributes: ['introduction'],
                //order: [['satisfaction', 'DESC']],
                required: false,
            },
        ],
        attributes: ['id', 'username', 'profile'],
        where: { [Op.and]: [{ position: 'mentor' }, { id: { [Op.or]: ids } }] },
        //order: [['createdAt', 'DESC']],
        order: [[{ model : Mentorinfo },'satisfaction', 'DESC']]
    })
};
