'use strict';

const { User, Job, Characteristic, Education, Career } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;
const user_characteristic = model.sequelize.models.user_characteristic;

const service = require('../services/menu');
const { keySelectWhere, parseValue, parseIds, jobUserFind, educationUserFind, careerUserFind, userMentoFilter } = service;

const { Op } = require('sequelize');

exports.searchMentoT = async (req, res) => {
    let { word } = req.query;

    let ids = [];
    let id = await Job.findOne({
        attributes: ['id'],
        where: { job: {[Op.like]: '%'+word+'%'} },
    }).then(async (data) => {
        if(data === null) return;

        return await user_job.findAll({
            attributes: ['UserId'],
            where: { JobId: data.id },
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    }).catch((err) => {
        return res.status(500).json({ err });
    });

    
    if(id) {
        for(let x = 0; x < id.length; x++) {
            ids.push(id[x].UserId);
        }
    }

    id = await Characteristic.findOne({
        attributes: ['id'],
        where: { characteristic : {[Op.like]: '%'+word+'%'} },
    }).then(async (data) => {
        if(data === null) return;

        return await user_characteristic.findAll({
            attributes: ['UserId'],
            where: { CharacteristicId: data.id },
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    }).catch((err) => {
        return res.status(500).json({ err });
    });

    if(id) {
        for(let x = 0; x < id.length; x++) {
            ids.push(id[x].UserId);
        }
    }

    id = await User.findAll({
        attributes: ['id'],
        where: { mbti: word },
    }).catch((err) => {
        return res.status(500).json({ err });
    });

    if(id) {
        for(let x = 0; x < id.length; x++) {
            ids.push(id[x].id);
        }
    }

    let set = new Set(ids);
    ids = [...set];

    if(ids.length === 0) return res.status(400).json({ message: "No data" });
    else userMentoFilter(ids).then((data) => {
        return res.status(200).json({ data: data });
    }).catch((err) => {
        return res.status(500).json({ err });
    });
};

exports.searchMentoB = async (req, res) => {
    let { job, university, education, company, career} = req.query;
    let keywords = req.query;
    let keys = Object.keys(keywords);
    let value = parseValue(keywords, keys);

    let id, ids = [];
    let where_education, where_career = null;
    
    if(job) {
        id = await jobUserFind(value, keys);
        for(let idx = 0; idx < id.length; idx++) ids.push(id[idx].UserId);
    } 

    where_education = keySelectWhere('education', 'university',ids, value, keys);
    if (ids.length !== 0 && (education || university)) {
        id = await educationUserFind(where_education);
        ids = parseIds(id);
    }

    where_career = keySelectWhere('career', 'company',ids, value, keys);
    if (ids.length !== 0 && (career || company)) {
        id = await careerUserFind(where_career);
        ids = parseIds(id);
    }

    let set = new Set(ids); //. 중복 제거
    ids = [...set];
    
    if(ids.length === 0) return res.status(400).json({ message: "No data" });
    else userMentoFilter(ids).then((data) => {
        return res.status(200).json({ data: data });
    }).catch((err) => {
        return res.status(500).json({ err });
    });
}