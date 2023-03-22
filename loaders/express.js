'use strict';

const _express = require('express');

const _bodyParser = require('body-parser');
const _cors = require('cors');

const _app = _express();

_app.use(_bodyParser.json());
_app.use(_bodyParser.urlencoded({ extended: true }));
_app.use(_cors());

module.exports = _app;