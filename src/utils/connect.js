'use strict';

const _sequelize = require('sequelize');
const _config = require('config');

const User = require('../models/user');
const Jobcategory = require('../models/job_category');
const Job = require('../models/job');
const Characteristic = require('../models/characteristic');
const Education = require('../models/education');
const Educationinfo = require('../models/education_info');
const Career = require('../models/career');
const Careerinfo = require('../models/career_info');
const Companysizeinfo = require('../models/company_size_info');
const Mentorinfo = require('../models/mentor_info');
const Mentorreview = require('../models/mentor_review');
const Mentorproduct = require('../models/mentor_product');
const Mentorevaluation = require('../models/mentor_evaluation');
const Mentorcareer = require('../models/mentor_career');
const Mentorstrength = require('../models/mentor_strength');
const Portfolio = require('../models/portfolio');
const Portfoliopreview = require('../models/portfolio_preview');
const Portfoliorecommendation = require('../models/portfolio_recommendation');
const Portfolioprogress = require('../models/portfolio_progress');

// new Sequelize를 통해 MySQL 연결 객체를 생성한다.
const sequelize = new _sequelize(
    _config.get('mysql_local.database'),
    _config.get('mysql_local.username'),
    _config.get('mysql_local.password'),
    {
        host: _config.get('mysql_local.host'),
        dialect: _config.get('mysql_local.dialect'),
        logging: _config.get('server.state') === 'production' ? false : console.log
    },
);

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Jobcategory = Jobcategory;
db.Job = Job;
db.Characteristic = Characteristic;
db.Education = Education;
db.Educationinfo = Educationinfo;
db.Career = Career;
db.Careerinfo = Careerinfo;
db.Companysizeinfo = Companysizeinfo;
db.Mentorinfo = Mentorinfo;
db.Mentorreview = Mentorreview;
db.Mentorproduct = Mentorproduct;
db.Mentorevaluation = Mentorevaluation;
db.Mentorcareer = Mentorcareer;
db.Mentorstrength = Mentorstrength;
db.Portfolio = Portfolio;
db.Portfoliopreview = Portfoliopreview;
db.Portfoliorecommendation = Portfoliorecommendation;
db.Portfolioprogress = Portfolioprogress;

User.init(sequelize);
Jobcategory.init(sequelize);
Job.init(sequelize);
Characteristic.init(sequelize);
Education.init(sequelize);
Educationinfo.init(sequelize);
Career.init(sequelize);
Careerinfo.init(sequelize);
Companysizeinfo.init(sequelize);
Mentorinfo.init(sequelize);
Mentorreview.init(sequelize);
Mentorproduct.init(sequelize);
Mentorevaluation.init(sequelize);
Mentorcareer.init(sequelize);
Mentorstrength.init(sequelize);
Portfolio.init(sequelize);
Portfoliopreview.init(sequelize);
Portfoliorecommendation.init(sequelize);
Portfolioprogress.init(sequelize);

User.associate(db);
Jobcategory.associate(db);
Job.associate(db);
Characteristic.associate(db);
Education.associate(db);
Educationinfo.associate(db);
Career.associate(db);
Careerinfo.associate(db);
Companysizeinfo.associate(db);
Mentorinfo.associate(db);
Mentorreview.associate(db);
Mentorproduct.associate(db);
Mentorevaluation.associate(db);
Mentorcareer.associate(db);
Mentorstrength.associate(db);
Portfolio.associate(db);
Portfoliopreview.associate(db);
Portfoliorecommendation.associate(db);
Portfolioprogress.associate(db);

module.exports = db;
