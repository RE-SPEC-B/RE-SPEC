'use strict';

const _sequelize = require('sequelize');

module.exports = class Careerinfo extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                career: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Careerinfo',
                tableName: 'career_info',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Careerinfo.hasMany(db.Career, { foreignKey: 'career_enum', sourceKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
