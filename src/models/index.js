'use strict';

const models = {
    User: require('./user/user'),
    Jobcategory: require('./other/job_category'),
    Job: require('./other/job'),
    Characteristic: require('./other/characteristic'),
    Education: require('./user/education'),
    Educationinfo: require('./user/education_info'),
    Career: require('./user/career'),
    Careerinfo: require('./user/career_info'),
    Companysizeinfo: require('./user/company_size_info'),
    Mentorinfo: require('./mentor/mentor_info'),
    Mentorreview: require('./mentor/mentor_review'),
    Mentorproduct: require('./mentor/mentor_product'),
    Mentorevaluation: require('./mentor/mentor_evaluation'),
    Mentorcareer: require('./mentor/mentor_career'),
    Mentorstrength: require('./mentor/mentor_strength'),
    Portfolio: require('./portfolio/portfolio'),
    Portfoliopreview: require('./portfolio/portfolio_preview'),
    Portfoliorecommendation: require('./portfolio/portfolio_recommendation'),
    Portfolioprogress: require('./portfolio/portfolio_progress'),
    Reservation: require('./reservation/reservation'),
};

module.exports = models;