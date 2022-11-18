"use strict";

const express = require("express");
const router = express.Router();

const authRoute = require("../controllers/auth/route");
const userRoute = require("../controllers/user/route");

router.use("/auth", authRoute);
router.use("/user", userRoute);

module.exports = router;
