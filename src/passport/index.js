const _passport = require('passport');

const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const naver = require('./naverStrategy');

const User = require('../models/user');

module.exports = () => {
    _passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    _passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
    google();
    naver();
}