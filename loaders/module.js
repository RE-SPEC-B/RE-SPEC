'use strict';

// 모듈 선언
const { sequelize } = require('../src/utils/connect'); // db
const _admin = require('firebase-admin');
const _config = require('config');

const _morgan = require('morgan'); // log
const logger = require('../src/functions/winston');

const _session = require('express-session'); // passport
const _passport = require('passport');

const serviceAccount = require('../re-spec-864ab-firebase-adminsdk-ff1gn-113413de90'); // firebase

const { _swaggerUi } = require('../src/modules/swagger'); // swagger
const swaggerFile = require('../src/modules/swagger.json');

module.exports = {
    sequelize,
    _admin,
    _config,
    _morgan,
    logger,
    _session,
    _passport,
    serviceAccount,
    _swaggerUi,
    swaggerFile,
};
