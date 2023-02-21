'use strict';

const service = require('../services/data');

const {
    enumValueGet
} = service;

const { success, fail } = require('../functions/responseStatus');

exports.enumValue = async (req, res) => {
    let data = await enumValueGet();
    return success(res, 200, 'Get enum data success.', data);
}