'use strict';

const _sequelize = require('sequelize');

module.exports = class Job extends _sequelize.Model {
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
                job: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
                jobenum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
                popularity: {
                    type: _sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Job',
                tableName: 'job',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    // 다른 모델과의 관계
    static associate(db) {
        db.Job.belongsTo(db.Jobcategory, {
            foreignKey: 'categorykey',
            targetKey: 'id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.Job.belongsToMany(db.User, { through: 'user_job' });
    }
};
