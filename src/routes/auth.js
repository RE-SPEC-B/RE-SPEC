'use strict';

const _express = require('express');
const _router = _express.Router();

const _passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

const ctrl = require('../controllers/auth');

// Local Login
_router.post('/register', isNotLoggedIn, ctrl.register);
_router.post('/local', _passport.authenticate('local', { failureRedirect: '/'}), ctrl.localLogin);
_router.get('/logout', isLoggedIn, ctrl.logout);

_router.get('/kakao', _passport.authenticate('kakao'), ctrl.kakaoLogin);
_router.get('/kakao/callback', _passport.authenticate('kakao', { failureRedirect: '/'}), ctrl.kakaoLoginCallback);

_router.get('/google', _passport.authenticate('google', { score: ['profile', 'email'] }), ctrl.googleLogin);
_router.get('/google/callback', _passport.authenticate('google', { failureRedirect: '/'}), ctrl.googleLoginCallback);

_router.get('/naver', _passport.authenticate('naver'), ctrl.naverLogin);
_router.get('/naver/callback', _passport.authenticate('naver', { failureRedirect: '/'}), ctrl.naverLoginCallback);

module.exports = _router;
