'use strict';

// 모듈 선언
const _express = require('express');
const _app = _express();

const _bodyParser = require('body-parser');
const _cors = require('cors');

const { sequelize } = require('./src/utils/connect');
const _config = require('config');

const _morgan = require('morgan');
const logger = require('./src/functions/winston');

const _session = require('express-session');
const _passport = require('passport');

_app.use(_session({ secret: 'secret', resave: false, saveUninitialized: false }));
_app.use(_passport.initialize());
_app.use(_passport.session());

const { _swaggerUi } = require('./src/modules/swagger');
const swaggerFile = require('./src/modules/swagger.json');

// 웹세팅
_app.use(_bodyParser.json());
_app.use(_bodyParser.urlencoded({ extended: true }));
_app.use(_cors());

_app.use(_morgan(':method ":url HTTP/:http-version" :status :response-time ms', { stream: logger.stream }));

const passportConfig = require('./src/passport');
passportConfig();

// 라우팅
const api_router = require('./src/routes');

_app.use("/api-docs", _swaggerUi.serve, _swaggerUi.setup(swaggerFile));
_app.use('/', api_router);

// 서버 연결
_app.listen(_config.get('server.port'), () => {
    logger.info(`Server Running on ${_config.get('server.port')} Port!`);
});

// DB 연결
// alter : true -> 기존데이터 유지하며, 테이블 업데이트
sequelize
    .sync({ force: false })
    .then(() => {
        logger.info('Success Connecting DB!');
    })
    .catch((err) => {
        console.error(err);
    });
