'use strict';

const _sequelize = require('sequelize');

module.exports = class Companysizeinfo extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                company_size: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Companysizeinfo',
                tableName: 'company_size_info',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Companysizeinfo.hasMany(db.Career, { foreignKey: 'company_size_enum', sourceKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
