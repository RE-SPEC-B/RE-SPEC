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
        logging: _config.get('server.state') === 'production' ? false : console.log,
        timezone: _config.get('mysql_local.timezone'), // Asia/Seoul
    },
);

Object.values(models).forEach((model) => model.init(sequelize));
Object.values(models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(models));

module.exports = {
    sequelize,
    ...models,
};
