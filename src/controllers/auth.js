'use strict';

const _passport = require('passport');

const _bcrypt = require('bcrypt');

const User = require('../models/user');
const logger = require('../functions/winston');

exports.register = async (req, res, next) => {
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
            return res.status(405).json({
                message : "User already exists.",
            });
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
    _passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            logger.error(`Local Login Error!`);
            
            return next(authError);
        }

        if(!user) {
            // 로컬 로그인 시 가입한 유저가 아닐 경우
            logger.warn(`is Not User ${user}`);

            return res.status(403).json({
                message: "Not User",
            });
        }

        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.status(200).json({
                message: "Local login success",
            });
        });
    }) (req, res, next);
};

exports.logout = (req, res) => {
    logger.info(`logout`);

    req.logout();
    req.session.destory();

    return res.status(204).json({
        message: "Login success",
    });
};

exports.kakaoLogin = (req, res) => {
    logger.info(`Kakao Login`);
};

exports.kakaoLoginCallback = (req, res) => {
    _passport.authenticate('kakao', (err, user) => {
        logger.info(`Kakao Login Callback`);

        if(!user) {
            return res.status(403).json({
                message: "Kakao user not found",
            });
        }

        req.logIn(user, (err) => {
            return res.status(200).json({
                message: "Kakao login success",
                user: user,
            });
        });
    })(req, res);
};

exports.googleLogin = (req, res) => {
    logger.info(`Google Login`);
};

exports.googleLoginCallback = (req, res) => {
    _passport.authenticate('google', (err, user) => {
        logger.info(`Google Login Callback`);

        if(err) {
            console.error(err);
        }

        if(!user) {
            console.log("Jehee1");
            return res.status(403).json({
                message: "Google user not found",
            });
        }

        req.logIn(user, (err) => {
            console.log("Jehee2");
            return res.status(200).json({
                message: "Google login success",
                user: user,
            });
        });
    })(req, res);
};

exports.naverLogin = (req, res) => {
    logger.info(`Naver Login`);
};

exports.naverLoginCallback = (req, res) => {
    _passport.authenticate('naver', (err, user) => {
        logger.info(`Naver Login Callback`);

        if(!user) {
            return res.status(403).json({
                message: "Naver user not found",
            });
        }

        req.logIn(user, (err) => {
            return res.status(200).json({
                message: "Naver login success",
                user: user,
            });
        });
    })(req, res);
};