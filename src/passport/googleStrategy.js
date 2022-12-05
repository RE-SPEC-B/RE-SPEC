const _passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const _config = require('config');

const User = require('../models/user');

module.exports = () => {
    _passport.use(new GoogleStrategy({
        clientID: _config.get('passport_client_Id.google_id'),
        clientSecret: _config.get('passport_client_Id.google_secret'),
        callbackURL: _config.get('passport_client_Id.google_callback'),
    },
    async(accessToken, refreshToken, profile, done) => {
        logger.info(`Google User Profile : ${profile}`);

        try {
            const isUser = await User.findOne({
                where: { 
                    snsId: profile.id,
                    provider: 'google' 
                },
            });

            if(isUser) {
                done(null, isUser);
            }

            else {
                const newUser = await User.create({
                    email: profile._json.email,
                    username: profile.displayName,
                    snsId: profile.id,
                    provider: 'google',
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