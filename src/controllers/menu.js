'use strict';

const service = require('../services/menu');
const {
    keySelectWhere,
    parseValue,
    parseIds,
    jobUserFindT,
    jobUserFindB,
    AllUserFindB,
    characteristicUserFind,
    companyUserFind,
    mbtiUserFind,
    educationUserFind,
    careerUserFind,
    userMentoFilter,
} = service;

const { success, fail } = require('../functions/responseStatus');

exports.searchMentoT = async (req, res) => {
    let { word, order } = req.query;

    let ids = [];
    let id = await jobUserFindT(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].UserId);

    id = await characteristicUserFind(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].UserId);

    id = await companyUserFind(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].userkey);

    // id = await mbtiUserFind(word);
    // if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].id);
    // 잠시 Keep

    let set = new Set(ids);
    ids = [...set];

    if (ids.length === 0) return fail(res, 404, 'No data.');
    else
        userMentoFilter(ids, order)
            .then((data) => {
                data.push({ count: data.length });
                return success(res, 200, 'Search mentor data by keyword success.', data);
            })
            .catch((err) => {
                return fail(res, 500, err);
            });
};

exports.searchMentoB = async (req, res) => {
    let { jobenum, university, educationenum, companysizeenum, careerenum, order } = req.query;
    let keywords = req.query;
    let keys = Object.keys(keywords);
    let value = parseValue(keywords, keys);

    let id,
        ids = [];
    let where_education,
        where_career = null;

    if (jobenum) {
        id = await jobUserFindB(value, keys);
        for (let idx = 0; idx < id.length; idx++) ids.push(id[idx].UserId);
    } else {
        id = await AllUserFindB();
        for (let idx = 0; idx < id.length; idx++) ids.push(id[idx].id);
    }

    where_education = keySelectWhere('educationenum', 'university', ids, value, keys);
    if (ids.length !== 0 && (educationenum || university)) {
        id = await educationUserFind(where_education);
        ids = parseIds(id);
    }

    where_career = keySelectWhere('careerenum', 'companysizeenum', ids, value, keys);
    if (ids.length !== 0 && (careerenum || companysizeenum)) {
        id = await careerUserFind(where_career);
        ids = parseIds(id);
    }

    let set = new Set(ids); // 중복 제거
    ids = [...set];

    if (ids.length === 0) return fail(res, 404, 'No data.');
    else
        userMentoFilter(ids, order)
            .then((data) => {
                data.push({ count: data.length });
                return success(res, 200, 'Search mentor data by filter success.', data);
            })
            .catch((err) => {
                return fail(res, 500, err);
            });
};
