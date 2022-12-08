const _passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const _config = require('config');

const User = require('../models/user');

module.exports = () => {
    _passport.use(new GoogleStrategy({
        clientID: "71831102496-rgnklisblre3ktjibhhq7nggom1tdqvm.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/auth/google/callback"
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
                    email: "GOOGLE" + profile._json.email,
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