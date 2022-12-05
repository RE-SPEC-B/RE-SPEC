'use strict';

const passport = require('passport');
const _passport = require('passport');

const _bcrypt = require('bcrypt');

const User = require('../models/user');
const logger = require('../functions/winston');

exports.signUp = async (req, res, next) => {
    try {
        const isUser = await User.findOne({
            where: { 
                email: req.body.email,
             }
        });

        const hashPassword = await _bcrypt.hash(req.body.password, 12);

        // 가입된 유저
        if(isUser) {
            logger.info(`Registered User : ${req.body.email}`);
            return res.redirect('/');
        }

        else {
            const newUser = await User.create({
                username: req.body.name,
                email: req.body.email,
                password: hashPassword,
                provider: 'local',
            });
        }
    }


    catch(error) {
        console.error(error);
    }
}

exports.localLogin = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            logger.error(`Local Login Error!`);
            
            return next(authError);
        }

        if(!user) {
            // 로컬 로그인 시 가입한 유저가 아닐 경우
            logger.warn(`is Not User ${user}`);

            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.redirect('/');
        });
    }) (req, res, next);
};

exports.logout = (req, res) => {
    logger.info(`logout`);

    req.logout();
    req.session.destory();

    res.redirect('/');
};

exports.kakaoLogin = (req, res) => {
    logger.info(`Kakao Login`);
};

exports.kakaoLoginCallback = (rqe, res) => {
    logger.info(`Kakao Login Callback`);
    res.redirect('/');
};

exports.googleLogin = (req, res) => {
    logger.info(`Google Login`);
};

exports.googleLoginCallback = (req, res) => {
    logger.info(`Google Login Callback`);
    res.redirect('/');
};

exports.naverLogin = (req, res) => {
    logger.info(`Naver Login`);
};

exports.naverLoginCallback = (req, res) => {
    logger.info(`Naver Login Callback`);
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).send("You need Login");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        const message = encodeURI("is Loggin On");
        res.redirect(`/?error=${message}`);
    }
};