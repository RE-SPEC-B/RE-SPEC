const GoogleStrategy = require('passport-google-oauth20').Strategy;
const _passport = require('passport');

const _config = require('config');

const User = require('../models/user/user');
const logger = require('../functions/winston');

module.exports = () => {
    _passport.use(
        new GoogleStrategy(
            {
                clientID: _config.get('passport_client_Id.google_id'),
                clientSecret: _config.get('passport_client_Id.google_secret'),
                callbackURL: _config.get('passport_client_Id.google_callback'),
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
                        where: { sns_id: profile.id, provider: 'google' },
                    });

                    if (is_user) {
                        logger.info(`User ${profile.displayName} is already registered.`);
                        done(null, is_user);
                    } else {
                        const new_user = await User.create({
                            email: 'GOOGLE' + profile._json.email,
                            user_name: profile.displayName,
                            sns_id: profile.id,
                            provider: 'google',
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
