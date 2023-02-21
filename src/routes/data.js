'use strict';

const _express = require('express');
const _router = _express.Router();

const ctrl = require('../controllers/data');

_router.get("/enum", ctrl.enumValue);

module.exports = _router;
