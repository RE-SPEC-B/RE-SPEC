'use strict';

const _express = require('express');
const _router = _express.Router();

const _passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

const ctrl = require('../controllers/auth');

// Local Login
_router.post('/register', isNotLoggedIn, ctrl.localRegister);
_router.post('/login', isNotLoggedIn, ctrl.localLogin);
_router.get('/logout', isLoggedIn, ctrl.logout);

_router.get('/login/kakao', _passport.authenticate('kakao'), ctrl.kakaoLogin);
_router.get('/login/kakao/callback', ctrl.kakaoLoginCallback);

_router.get('/login/google', _passport.authenticate('google', { scope: ['profile', 'email'] }), ctrl.googleLogin);
_router.get('/login/google/callback', ctrl.googleLoginCallback);

_router.get('/login/naver', _passport.authenticate('naver'), ctrl.naverLogin);
_router.get('/login/naver/callback', ctrl.naverLoginCallback);

module.exports = _router;
