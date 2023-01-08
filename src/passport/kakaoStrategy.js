const KakaoStrategy = require('passport-kakao').Strategy;
const _passport = require('passport');

const _config = require('config');

const User = require('../models/user');
const logger = require('../functions/winston');

module.exports = () => {
    _passport.use(
        new KakaoStrategy(
            {
                clientID: _config.get('passport_client_Id.kakao_id'),
                callbackURL: _config.get('passport_client_Id.kakao_callback'),
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const isUser = await User.findOne({
                        attributes: ['id', 
                        'profile', 
                        'username', 
                        'email', 
                        'password', 
                        'introduction', 
                        'phonenum', 
                        'position'],
                        where: { snsId: profile.id, provider: 'kakao' },
                    });

                    if (isUser) {
                        logger.info(`User ${profile.displayName} is already registered.`);
                        done(null, isUser);
                    } else {
                        const newUser = await User.create({
                            email: 'KAKAO' + profile._json.kakao_account.email,
                            username: profile.displayName,
                            snsId: profile.id,
                            provider: 'kakao',
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};
