'use strict';

const logger = require('../functions/winston');

exports.success = (res, code, message = 'No message.', data = 'No data.') => {
    logger.info(message);
    return res.status(code).json({
        message: message,
        data: data,
    });
};

exports.fail = (res, code, message = 'No message.', detail = 'No detail.') => {
    if (code >= 500) {
        logger.error(message);
        return res.status(code).json({
            message: message,
            detail: detail,
        });
    } else if (code >= 400) {
        logger.warn(message);
        return res.status(code).json({
            message: message,
            detail: detail,
        });
    }
};
