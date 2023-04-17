const KakaoStrategy = require('passport-kakao').Strategy;
const _passport = require('passport');

const _config = require('config');

const User = require('../models/user/user');
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
                    const is_user = await User.findOne({
                        attributes: ['id',
                        'profile',
                        'user_name',
                        'email',
                        'password',
                        'introduction',
                        'phone_num',
                        'position'],
                        where: { sns_id: profile.id, provider: 'kakao' },
                    });

                    if (is_user) {
                        logger.info(`User ${profile.displayName} is already registered.`);
                        done(null, is_user);
                    } else {
                        const new_user = await User.create({
                            email: 'KAKAO' + profile._json.kakao_account.email,
                            user_name: profile.displayName,
                            sns_id: profile.id,
                            provider: 'kakao',
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
