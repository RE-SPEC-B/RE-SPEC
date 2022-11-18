"use strict";

const _express = require('express');
const _router = _express.Router();

const auth_route = require('../controllers/auth/route');
const user_route = require('../controllers/user/route');

_router.use("/auth", auth_route);
_router.use("/user", user_route);

module.exports = _router;
