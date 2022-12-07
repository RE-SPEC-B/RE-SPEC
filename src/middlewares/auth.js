exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).send("You need Login");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        const message = encodeURI("is Loggin On");
        res.redirect(`/?error=${message}`);
    }
};