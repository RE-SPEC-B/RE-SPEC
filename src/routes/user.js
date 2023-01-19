'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
// const upload = require("../middlewares/multer");

const ctrl = require('../controllers/user');

_router.post("/register/mentor", isLoggedIn, ctrl.mentorRegistration);
_router.get("/mentor/:userid/info", ctrl.mentorInfo);
_router.get("/mentor/:userid/reviews", ctrl.mentorReviews);
// _router.put("/info", isLoggedIn, upload.single("image"), ctrl.userInfo);

module.exports = _router;
