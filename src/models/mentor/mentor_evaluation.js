'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorevaluation extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: _sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                evaluation: {
                    type: _sequelize.STRING(50),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorevaluation',
                tableName: 'mentorevaluation',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorevaluation.hasOne(db.Mentorreview, { foreignKey: 'evaluationkey', sourceKey: 'id' });
    }
};
