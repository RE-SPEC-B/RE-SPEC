'use strict';

const _sequelize = require('sequelize');

module.exports = class Educationinfo extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                education: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Educationinfo',
                tableName: 'education_info',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Educationinfo.hasMany(db.Education, { foreignKey: 'education_enum', sourceKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
