'use strict';

const _express = require('express');
const _router = _express.Router();

const ctrl = require('../controllers/menu');

_router.get("/top/search/mento", ctrl.searchMentoT);
_router.get("/bottom/search/mento", ctrl.searchMentoB);

module.exports = _router;
