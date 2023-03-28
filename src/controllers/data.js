'use strict';

const data = require('../services/data');

const { enumValueGet } = data;

const { success, fail } = require('../functions/responseStatus');

exports.enumValue = async (req, res) => {
    let data = await enumValueGet();
    return success(res, 200, 'Get enum data success.', data);
};
