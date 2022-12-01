'use strict';

const _sequelize = require('sequelize');
const _config = require('config');

const User = require('../models/user');
const Jobcategory = require('../models/job_category');
const Job = require('../models/job');
const Characteristic = require('../models/characteristic');
const Education = require('../models/education');
const Career = require('../models/career');

// new Sequelize를 통해 MySQL 연결 객체를 생성한다.
const sequelize = new _sequelize(
    _config.get('mysql_local.database'),
    _config.get('mysql_local.username'),
    _config.get('mysql_local.password'),
    {
        host: _config.get('mysql_local.host'),
        dialect: _config.get('mysql_local.dialect'),
    },
);

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Jobcategory = Jobcategory;
db.Job = Job;
db.Characteristic = Characteristic;
db.Education = Education;
db.Career = Career;

User.init(sequelize);
Jobcategory.init(sequelize);
Job.init(sequelize);
Characteristic.init(sequelize);
Education.init(sequelize);
Career.init(sequelize);

User.associate(db);
Jobcategory.associate(db);
Job.associate(db);
Characteristic.associate(db);
Education.associate(db);
Career.associate(db);

module.exports = db;
