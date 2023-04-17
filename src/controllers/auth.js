'use strict';

const _passport = require('passport');

const auth = require('../services/auth');
const { register, userFind } = auth;

const { success, fail } = require('../functions/responseStatus');

exports.localRegister = async (req, res) => {
    const { user_name, email, password } = req.body;

    try {
        const is_user = await userFind(user_name, email);
        if (is_user) return fail(res, 403, 'Exist email or username.'); // 가입된 유저

        await register(user_name, email, password, 'local')
            .then(() => { return success(res, 200, 'Register success.'); })
            .catch((err) => { return fail(res, 500, `${err}`); });
    } catch (err) { return fail(res, 500, `${err}`); }
};

exports.localLogin = (req, res) => {
    _passport.authenticate('local', (auth_err, user, info) => {
        if (auth_err) return fail(res, 500, `${auth_err}`);

        // 로컬 로그인후, 정상 오류시
        if (!user) {
            if (info.message === 'Invalid password.') {
                return fail(res, 403, info.message);
            } else {
                return fail(res, 404, info.message);
            }
        }

        return req.login(user, (login_error) => {
            if (login_error) return fail(res, 500, `${login_error}`);
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
    _passport.authenticate('kakao', (auth_err, user) => {
        if (!user) return fail(res, 404, 'Kakao user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Kakao login success.', user); });
    })(req, res);
};

exports.googleLoginCallback = (req, res) => {
    _passport.authenticate('google', (auth_err, user) => {
        if (!user) return fail(res, 404, 'Google user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Google login success.', user); });
    })(req, res);
};

exports.naverLoginCallback = (req, res) => {
    _passport.authenticate('naver', (auth_err, user) => {
        if (!user) return fail(res, 404, 'Naver user not found.');
        req.logIn(user, (err) => { return success(res, 200, 'Naver login success.', user); });
    })(req, res);
};
