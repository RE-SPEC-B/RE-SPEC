'use strict';

const _sequelize = require('sequelize');
const _config = require('config');

const models = require('../models/index');

const sequelize = new _sequelize(
    _config.get('mysql_local.database'),
    _config.get('mysql_local.username'),
    _config.get('mysql_local.password'),
    {
        host: _config.get('mysql_local.host'),
        dialect: _config.get('mysql_local.dialect'),
        logging: (message) => {
            console.log(message);
            // 사이즈가 작은 프로젝트이기때문에 파일시스템이 아닌 DB에 로깅 결정
            // 프로젝트가 발전하면 추후에 로깅 방식 변경 고려
            if (!message.includes('logs')) {
                logToDatabase(message);
            }
        },
        timezone: _config.get('mysql_local.timezone'), // Asia/Seoul
    },
);

// 로그 테이블 생성
const Log = sequelize.define('log', {
    message: {
        type: _sequelize.STRING,
        allowNull: false,
    },
});

// DB에 로그 저장
const logToDatabase = (message) => {
    Log.create({ message });
};

Object.values(models).forEach((model) => model.init(sequelize));
Object.values(models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(models));

module.exports = {
    sequelize,
    ...models,
};
