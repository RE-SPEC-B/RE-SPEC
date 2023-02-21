'use strict';

const _express = require('express');
const _router = _express.Router();

const auth_route = require('./auth');
const user_route = require('./user');
const menu_route = require('./menu');
const data_route = require('./data');

_router.use('/auth', auth_route);
_router.use('/user', user_route);
_router.use('/menu', menu_route);
_router.use('/data', data_route);

module.exports = _router;
