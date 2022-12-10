'use strict';

const _passport = require('passport');
const _bcrypt = require('bcrypt');

const User = require('../models/user');
const { Op } = require('sequelize');

const logger = require('../functions/winston');

exports.localRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const isUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] } });

        if (isUser) {
            // 가입된 유저
            logger.warn(`Exist email or username.`);
            return res.status(403).json({ message: 'Exist email or username.' });
        }

        const hash_password = await _bcrypt.hash(password, 12);
        await User.create({
            username: username,
            email: email,
            password: hash_password,
            provider: 'local',
        })
            .then(() => {
                logger.info(`Register success.`);
                return res.status(200).json({ message: 'Register success.' });
            })
            .catch((err) => {
                logger.error(`${err}`);
                return res.status(500).json({ message: `${err}` });
            });
    } catch (error) {
        logger.error(`${error}`);
        return res.status(500).json({ message: `${error}` });
    }
};

exports.localLogin = (req, res) => {
    _passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            logger.error(`${authError}`);
            return res.status(500).json({ message: `${authError}` });
        }

        if (!user) {
            // 로컬 로그인후, 정상 오류시
            logger.warn(`${info.message}`);
            return res.status(403).json({ message: info.message });
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                logger.error(`${loginError}`);
                return res.status(500).json({ message: `${loginError}` });
            }

            return res.status(200).json({ message: 'Local login success.' });
        });
    })(req, res);
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            logger.error(`${err}`);
            return res.status(500).json({ message: `${err}` });
        }

        logger.info(`Logout success.`);
        return res.status(200).json({ message: 'Logout success.' });
    });
};

exports.kakaoLoginCallback = (req, res) => {
    _passport.authenticate('kakao', (authError, user) => {
        if (!user) {
            logger.warn(`Kakao user not found.`);
            return res.status(403).json({ message: 'Kakao user not found.' });
        }

        req.logIn(user, (err) => {
            logger.info(`Kakao login success.`);
            return res.status(200).json({
                message: 'Kakao login success.',
                user: user,
            });
        });
    })(req, res);
};

exports.googleLoginCallback = (req, res) => {
    _passport.authenticate('google', (authError, user) => {
        if (!user) {
            logger.warn(`Google user not found.`);
            return res.status(403).json({ message: 'Google user not found.' });
        }

        req.logIn(user, (err) => {
            logger.info(`Google login success.`);
            return res.status(200).json({
                message: 'Google login success.',
                user: user,
            });
        });
    })(req, res);
};

exports.naverLoginCallback = (req, res) => {
    _passport.authenticate('naver', (authError, user) => {
        if (!user) {
            logger.warn(`Naver user not found.`);
            return res.status(403).json({ message: 'Naver user not found.' });
        }

        req.logIn(user, (err) => {
            logger.info(`Naver login success.`);
            return res.status(200).json({
                message: 'Naver login success.',
                user: user,
            });
        });
    })(req, res);
};
