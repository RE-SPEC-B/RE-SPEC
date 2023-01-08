'use strict';

const _passport = require('passport');

const service = require('../services/auth')
const { register, userFind } = service;

const { success, fail } = require('../functions/responseStatus');

exports.localRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const isUser = await userFind(username, email);
        if (isUser) return fail(res, 403, 'Exist email or username.'); // 가입된 유저

        await register(username, email, password, 'local')
            .then(() => { return success(res, 200, 'Register success.'); })
            .catch((err) => { return fail(res, 500, `${err}`); });
    } catch (error) { return fail(res, 500, `${error}`); }
};

exports.localLogin = (req, res) => {
    _passport.authenticate('local', (authError, user, info) => {
        if (authError) return fail(res, 500, `${authError}`);

        // 로컬 로그인후, 정상 오류시
        if (!user) { 
            if (info.message === "Invalid password.") {
                return fail(res, 403, info.message)
            } else {
                return fail(res, 404, info.message)
            }
        }

        return req.login(user, (loginError) => {
            if (loginError) return fail(res, 500, `${loginError}`);
            return success(res, 200, 'Local login success.', user);
        });
    })(req, res);
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return fail(res, 500, `${err}`);
        return success(res, 200, 'Logout success.');
    });
};

exports.kakaoLoginCallback = (req, res) => {
    _passport.authenticate('kakao', (authError, user) => {
        if (!user) return fail(res, 404, 'Kakao user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Kakao login success.', user); });
    })(req, res);
};

exports.googleLoginCallback = (req, res) => {
    _passport.authenticate('google', (authError, user) => {
        if (!user) return fail(res, 404, 'Google user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Google login success.', user); });
    })(req, res);
};

exports.naverLoginCallback = (req, res) => {
    _passport.authenticate('naver', (authError, user) => {
        if (!user) return fail(res, 404, 'Naver user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Naver login success.', user); });
    })(req, res);
};
