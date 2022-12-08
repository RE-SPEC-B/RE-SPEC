const _passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const _bcrypt = require('bcrypt');

const User = require('../models/user');
const logger = require('../functions/winston');

module.exports = () => {
    _passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async(email, password, done) => {
        try {
            const isUser = await User.findOne({ where: { email }});

            if(isUser) {
                const result = await _bcrypt.compare(password, isUser.password);
                if(result) {
                    done(null, isUser);
                }
                else {
                    logger.error(`is Not Password`);
                    done(null, false, { message: "Not Password"});
                }
            }
            else {
                logger.error(`is Not User`);
                done(null, false, { message: "Not User"});
            }
        }

        catch(error) {
            console.error(error);
            done(error);
        }
    }));
};