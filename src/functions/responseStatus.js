'use strict'

const logger = require('../functions/winston');

exports.success = (res, code, message, data) => {
    logger.info(message);
    return res.status(code).json({ 
        message : message,
        data: data
    });
};

exports.fail = (res, code, message, data) => {
    if( code >= 500 ) {
        logger.error(message);
        return res.status(code).json({ 
            message : message,
            data: data
        });
    } else if ( code >= 400 ) {
        logger.warn(message);
        return res.status(code).json({ 
            message : message,
            data: data
        });
    }
};