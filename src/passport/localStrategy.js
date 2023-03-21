const LocalStrategy = require('passport-local').Strategy;
const _passport = require('passport');
const _bcrypt = require('bcrypt');

const User = require('../models/user/user');

module.exports = () => {
    _passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
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
                        where: { email } 
                    });

                    if (isUser) {
                        const result = await _bcrypt.compare(password, isUser.password);
                        if (result) done(null, isUser);
                        else done(null, false, { message: 'Invalid password.' });
                    } else done(null, false, { message: 'User does not exist.' });
                } catch (error) {
                    done(error);
                }
            },
        ),
    );
};
