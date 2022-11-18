"use strict";

// 모듈 선언
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("config");

const morgan = require("morgan");
const logger = require("./src/functions/winston");

// 웹세팅
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("common", { stream: logger.stream }));

// 라우팅
const apiRouter = require("./src/routes");
app.use("/", apiRouter);

// 서버 연결
app.listen(config.get("server.port"), () => {
    logger.info(`Server Running on ${config.get("server.port")} Port!`);
});