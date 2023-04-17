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
                    const is_user = await User.findOne({ 
                        attributes: ['id', 
                        'profile', 
                        'user_name', 
                        'email', 
                        'password', 
                        'introduction', 
                        'phone_num', 
                        'position'],
                        where: { email } 
                    });

                    if (is_user) {
                        const result = await _bcrypt.compare(password, is_user.password);
                        if (result) done(null, is_user);
                        else done(null, false, { message: 'Invalid password.' });
                    } else done(null, false, { message: 'User does not exist.' });
                } catch (err) {
                    done(err);
                }
            },
        ),
    );
};
