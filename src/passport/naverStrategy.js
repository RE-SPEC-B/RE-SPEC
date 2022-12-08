const _passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;

const _config = require('config');

const User = require('../models/user');
const logger = require('../functions/winston');

module.exports = () => {
    _passport.use(new NaverStrategy({
        clientID: _config.get('passport_client_Id.naver_id'),
        clientSecret: _config.get('passport_client_Id.naver_secret'),
        callbackURL: _config.get('passport_client_Id.naver_callback'),
    },
    async(accessToken, refreshToken, profile, done) => {
        logger.info(`Naver User Profile : ${profile}`);

        try {
            const isUser = await User.findOne({
                where: { 
                    snsId: profile.id, 
                    provider: 'naver' 
                },
            });

            if(isUser) {
                logger.info(`is User ${profile}`);
                done(null, isUser);
            }
            else {
                const newUser = await User.create({
                    email: "NAVER" + profile._json.email,
                    username: profile.displayName,
                    snsId: profile.id,
                    provider: 'naver',
                });
                done(null, newUser);
            }
        }

        catch(error) {
            console.error(error);
            done(error);
        }
    }));
};