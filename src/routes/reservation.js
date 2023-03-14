'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
// const upload = require("../middlewares/multer");

const ctrl = require('../controllers/reservation');

_router.post('/create', isLoggedIn, ctrl.createReservation);

module.exports = _router;
