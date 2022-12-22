'use strict';

// const service = require('../services/menu');
// const { } = service;

const { User, Career } = require('../utils/connect');
const { success, fail } = require('../functions/responseStatus');

exports.mentorRegistration = async (req, res) => {
    let { career, company } = req.body;
    let username = req.session.sid

    let data = await User.findOne({
        attributes: ['id'],
        where: { username: username },
    })

    await User.update({
        position: 'mentor',
    }, {
        where: { id: data.id },
    });
    
    Career.create({
        career: career,
        company: company,
        userkey: data.id,
    }).then(() => {
        return success(res, 200, 'success.');
    }).catch(err => {
        return fail(res, 500, err);
    });
}
