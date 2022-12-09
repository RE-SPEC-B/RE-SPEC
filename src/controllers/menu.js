'use strict';

const service = require('../services/menu');
const {
    keySelectWhere,
    parseValue,
    parseIds,
    jobUserFindT,
    jobUserFindB,
    characteristicUserFind,
    mbtiUserFind,
    educationUserFind,
    careerUserFind,
    userMentoFilter,
} = service;

exports.searchMentoT = async (req, res) => {
    let { word } = req.query;

    let ids = [];
    let id = await jobUserFindT(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].UserId);

    id = await characteristicUserFind(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].UserId);

    id = await mbtiUserFind(word);
    if (id) for (let x = 0; x < id.length; x++) ids.push(id[x].id);

    let set = new Set(ids);
    ids = [...set];

    if (ids.length === 0) return res.status(400).json({ message: 'No data' });
    else
        userMentoFilter(ids)
            .then((data) => {
                return res.status(200).json({ data: data });
            })
            .catch((err) => {
                return res.status(500).json({ err });
            });
};

exports.searchMentoB = async (req, res) => {
    let { job, university, education, company, career } = req.query;
    let keywords = req.query;
    let keys = Object.keys(keywords);
    let value = parseValue(keywords, keys);

    let id,
        ids = [];
    let where_education,
        where_career = null;

    if (job) {
        id = await jobUserFindB(value, keys);
        for (let idx = 0; idx < id.length; idx++) ids.push(id[idx].UserId);
    }

    where_education = keySelectWhere('education', 'university', ids, value, keys);
    if (ids.length !== 0 && (education || university)) {
        id = await educationUserFind(where_education);
        ids = parseIds(id);
    }

    where_career = keySelectWhere('career', 'company', ids, value, keys);
    if (ids.length !== 0 && (career || company)) {
        id = await careerUserFind(where_career);
        ids = parseIds(id);
    }

    let set = new Set(ids); // 중복 제거
    ids = [...set];

    if (ids.length === 0) return res.status(400).json({ message: 'No data' });
    else
        userMentoFilter(ids)
            .then((data) => {
                return res.status(200).json({ data: data });
            })
            .catch((err) => {
                return res.status(500).json({ err });
            });
};
