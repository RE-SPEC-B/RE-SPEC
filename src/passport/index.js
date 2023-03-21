const _passport = require('passport');

const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const naver = require('./naverStrategy');

const User = require('../models/user/user');

const _config = require('config');

module.exports = () => {
    _passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    _passport.deserializeUser((req, id, done) => {
        User.findOne({ where: { id }})
            .then((user) => {
                req.session.sid = user.username;
                if(_config.get('server.state') !== 'production') {
                    console.log("Session Check :" + req.session.sid); // dev 단계 남겨놓음
                }
                done(null, user);
            })
            .catch((err) => done(err));
    });

    local();
    kakao();
    google();
    naver();
}