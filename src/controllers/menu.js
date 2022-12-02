'use strict';

const { User, Job, Characteristic, Education, Career } = require('../utils/connect');

const model = require('../utils/connect');
const user_job = model.sequelize.models.user_job;
const user_characteristic = model.sequelize.models.user_characteristic;

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

    if(ids.length === 0) {
        return res.status(400).json({ message: "No data" });
    } else {
        User.findAll({
            where: {[Op.and]: [
                { position: "mentoo" },
                { id: {[Op.or]: ids} },
            ]},
            order: [['createdAt', 'DESC']],
        }).then((data) => {
            return res.status(200).json({ data: data });
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    }
};

exports.searchMentoB = async (req, res) => {
    let keywords = req.query; // job, education, career, company, university
    let keys = Object.keys(keywords), keyword = [];
    
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        keyword.push(keywords[key].split(','));
    }

    let id, ids = [];
    let where_education, where_career = null;
    
    let a = (a,b,ids) => {
        let arr = [{ userkey: {[Op.or]: ids}}];
        let temp = [];
        for(let x of keys) {
            if(x === a || x === b) temp.push(x);
        }
        console.log(temp);
        console.log(keyword[keys.indexOf('education')])
        for(let x = 0; x < temp.length; x++) {
            arr.push({ [temp[x]] : {[Op.or]: keyword[keys.indexOf(temp[x])]}})
        }
        console.log(arr);
        return {[Op.and]: arr}
    }
    
    if(req.query.job) {
        id = await Job.findAll({
            attributes: ['id'],
            where: { job: {[Op.or]: keyword[keys.indexOf('job')]}},
            order: [['createdAt', 'DESC']],
        }).then(async (data) => {
            let job_id = [];
            for(let x = 0; x < data.length; x++) {
                job_id.push(data[x].id);
            }
            
            return await user_job.findAll({
                attributes: ['UserId'],
                where: { JobId: {[Op.or]: job_id}},
                order: [['createdAt', 'DESC']],
            }).catch((err) => {
                return res.status(500).json({ err });
            });
        }).catch((err) => {
            return res.status(500).json({ err });
        });
        
        for(let x = 0; x < id.length; x++) {
            ids.push(id[x].UserId);
        }
    } 
    
    console.log(ids);
    
    where_education = a('education', 'university',ids);
    console.log(where_education);
    if (ids.length !== 0 && (req.query.education || req.query.university)) {
        id = await Education.findAll({
            attributes: ['userkey'],
            where: where_education,
            order: [['createdAt', 'DESC']],
        }).then(async (data) => {
            console.log(data);
            if(data.length === 0) return;
            
            let education_id = [];
            for(let x = 0; x < data.length; x++) {
                education_id.push(data[x].userkey);
            }
            
            return await User.findAll({
                attributes: ['id'],
                where: { id : {[Op.or]: education_id}},
                order: [['createdAt', 'DESC']],
            }).catch((err) => {
                return res.status(500).json({ err });
            });
        }).catch((err) => {
            return res.status(500).json({ err });
        });
        
        if(id !== undefined) {
            ids = [];
            for(let x = 0; x < id.length; x++) {
                ids.push(id[x].id);
            }
        } else {
            ids = [];
        }
    }
    
    console.log(ids);
    
    where_career = a('career','company',ids);
    if (ids.length !== 0 && (req.query.career || req.query.company)) {
        id = await Career.findAll({
            attributes: ['userkey'],
            where: where_career,
            order: [['createdAt', 'DESC']],
        }).then(async (data) => {
            console.log(data);
            if(data.length === 0) return;
            
            let career_id = [];
            for(let x = 0; x < data.length; x++) {
                career_id.push(data[x].userkey);
            }
            
            return await User.findAll({
                attributes: ['id'],
                where: { id : {[Op.or]: career_id}},
                order: [['createdAt', 'DESC']],
            }).catch((err) => {
                return res.status(500).json({ err });
            });
        }).catch((err) => {
            return res.status(500).json({ err });
        });

        if(id !== undefined) {
            ids = [];
            for(let x = 0; x < id.length; x++) {
                ids.push(id[x].id);
            }
        } else {
            ids = [];
        }
    }

    let set = new Set(ids);
    ids = [...set];
    
    if(ids.length === 0) {
        return res.status(400).json({ message: "No data" });
    } else {
        User.findAll({
            where: {[Op.and]: [
                { position: "mentoo" },
                { id: {[Op.or]: ids} },
            ]},
            order: [['createdAt', 'DESC']],
        }).then((data) => {
            return res.status(200).json({ data: data });
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    }
}