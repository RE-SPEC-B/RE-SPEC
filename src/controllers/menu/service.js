'use strict';

const { User } = require('../../utils/connect');
const { Job } = require('../../utils/connect');
const { Characteristic } = require('../../utils/connect');

const model = require('../../utils/connect');
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
    let keywords = req.query; // job, characteristic, mbti
    let keys = Object.keys(keywords), keyword = [];
    
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        keyword.push(keywords[key].split(','));
    }
    
    let id, ids = [];
    
    if(req.query.job) {
        id = await Job.findAll({
            attributes: ['id'],
            where: { job: {[Op.or]: keyword[0]}},
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
    if (req.query.characteristic) {
        id = await Characteristic.findAll({
            attributes: ['id'],
            where: { characteristic : {[Op.or]: keyword[1]}},
            order: [['createdAt', 'DESC']],
        }).then(async (data) => {
            let characteristic_id = [];
            for(let x = 0; x < data.length; x++) {
                characteristic_id.push(data[x].id);
            }
    
            return await user_characteristic.findAll({
                attributes: ['UserId'],
                where: { CharacteristicId: {[Op.or]: characteristic_id}},
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
    if (req.query.mbti) {
        id = await User.findAll({
            attributes: ['id'],
            where: { mbti: {[Op.or]: keyword[2]}},
            order: [['createdAt', 'DESC']],
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    
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
            where: { id: {[Op.or]: ids}},
            order: [['createdAt', 'DESC']],
        }).then((data) => {
            return res.status(200).json({ data: data });
        }).catch((err) => {
            return res.status(500).json({ err });
        });
    }
}