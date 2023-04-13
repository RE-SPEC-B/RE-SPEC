'use strict';

const _sequelize = require('sequelize');

module.exports = class Jobcategory extends _sequelize.Model {
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
                category: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Jobcategory',
                tableName: 'job_category',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Jobcategory.hasMany(db.Job, {
            foreignKey: 'category_id',
            sourceKey: 'id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};
