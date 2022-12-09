'use strict';

const _express = require('express');
const _router = _express.Router();

const auth_route = require('./auth');
const user_route = require('./user');
const menu_route = require('./menu');

_router.use('/auth', auth_route);
_router.use('/user', user_route);
_router.use('/menu', menu_route);

// Test
_router.get('/', (req, res) => { res.render('index', { title: 'Express' }); });

module.exports = _router;
