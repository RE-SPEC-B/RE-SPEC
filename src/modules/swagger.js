'use strict';

const _swaggerUi = require('swagger-ui-express');
// const _swaggerAutogen = require('swagger-autogen')();

const options = {
    swaggerDefinition: {
        info: {
            title: `RE:SPEC's APIs`,
            version: '1.0.0',
            description: `Test the APIs!`,
        },
        host: 'localhost:5000',
        basePath: '/',
    },
    apis: ['./src/routes/index.js'],
    outputFile: './src/modules/swagger.json',
};

// _swaggerAutogen( options.outputFile, options.apis, options.swaggerDefinition);

module.exports = {
    _swaggerUi,
};
