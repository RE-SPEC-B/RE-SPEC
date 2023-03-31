const NaverStrategy = require('passport-naver').Strategy;
const _passport = require('passport');

const _config = require('config');

const User = require('../models/user/user');
const logger = require('../functions/winston');

module.exports = () => {
    _passport.use(
        new NaverStrategy(
            {
                clientID: _config.get('passport_client_Id.naver_id'),
                clientSecret: _config.get('passport_client_Id.naver_secret'),
                callbackURL: _config.get('passport_client_Id.naver_callback'),
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const is_user = await User.findOne({
                        attributes: ['id', 
                        'profile', 
                        'username', 
                        'email', 
                        'password', 
                        'introduction', 
                        'phonenum', 
                        'position'],
                        where: { snsId: profile.id, provider: 'naver' },
                    });

                    if (is_user) {
                        logger.info(`User ${profile.displayName} is already registered.`);
                        done(null, is_user);
                    } else {
                        const new_user = await User.create({
                            email: 'NAVER' + profile._json.email,
                            username: profile.displayName,
                            snsId: profile.id,
                            provider: 'naver',
                        });
                        done(null, new_user);
                    }
                } catch (err) {
                    done(err);
                }
            },
        ),
    );
};
