'use strict';

// 모듈 불러오기
const {
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
} = require('./loaders/module');

// 웹세팅
const _app = require('./loaders/express');

_app.use(_morgan(':method ":url HTTP/:http-version" :status :response-time ms', { stream: logger.stream }));

_app.use(_session({ secret: 'secret', resave: false, saveUninitialized: false }));
_app.use(_passport.initialize());
_app.use(_passport.session());

const passportConfig = require('./src/passport');
passportConfig();

// 라우팅
const api_router = require('./src/routes');

_app.use('/api-docs', _swaggerUi.serve, _swaggerUi.setup(swaggerFile));
_app.use('/', api_router);

// 서버 연결
_app.listen(_config.get('server.port'), () => {
    logger.info(`Server Running on ${_config.get('server.port')} Port!`);
});

// DB 연결
// alter: true -> 기존데이터 유지하며, 테이블 업데이트
sequelize
    .sync({ force: false })
    .then(() => {
        logger.info('Success Connecting DB!');
    })
    .catch((err) => {
        console.error(err);
    });

// Firebase 서비스 초기화
_admin.initializeApp({
    credential: _admin.credential.cert(serviceAccount),
});
