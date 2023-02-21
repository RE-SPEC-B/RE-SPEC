'use strict';

const _express = require('express');
const _router = _express.Router();

const ctrl = require('../controllers/menu');

_router.get("/search/mentor", ctrl.searchMentoT);
_router.get("/search/filter/mentor", ctrl.searchMentoB);

module.exports = _router;
