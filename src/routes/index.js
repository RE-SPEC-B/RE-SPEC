'use strict';

const _express = require('express');
const _router = _express.Router();

const auth_route = require('../controllers/auth/route');
const user_route = require('../controllers/user/route');
const menu_route = require('../controllers/menu/route');

_router.use('/auth', auth_route);
_router.use('/user', user_route);
_router.use('/menu', menu_route);

module.exports = _router;
