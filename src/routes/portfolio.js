'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
// const upload = require("../middlewares/multer");

const ctrl = require('../controllers/portfolio');

_router.post("/reserve", isLoggedIn, ctrl.portfolioReserve);

module.exports = _router;
