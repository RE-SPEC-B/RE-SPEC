'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

const ctrl = require('../controllers/user');

_router.post("/register/mentor", isLoggedIn, ctrl.mentorRegistration);

module.exports = _router;
