'use strict';

const _express = require('express');
const _router = _express.Router();

const ctrl = require('../controllers/menu');

_router.get("/top/search/mentor", ctrl.searchMentoT);
_router.get("/bottom/search/mentor", ctrl.searchMentoB);

module.exports = _router;
