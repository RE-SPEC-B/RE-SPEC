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
                    const isUser = await User.findOne({
                        attributes: ['id', 
                        'profile', 
                        'user_name', 
                        'email', 
                        'password', 
                        'introduction', 
                        'phone_num', 
                        'position'],
                        where: { snsId: profile.id, provider: 'google' },
                    });

                    if (isUser) {
                        logger.info(`User ${profile.displayName} is already registered.`);
                        done(null, isUser);
                    } else {
                        const newUser = await User.create({
                            email: 'GOOGLE' + profile._json.email,
                            user_name: profile.displayName,
                            sns_id: profile.id,
                            provider: 'google',
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
