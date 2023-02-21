'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorcareer extends _sequelize.Model {
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
                companyname: {
                    type: _sequelize.STRING(20),
                    allowNull: true,
                },
                company: {
                    type: _sequelize.STRING(20),
                    allowNull: true,
                },
                job: {
                    type: _sequelize.STRING(20),
                    allowNull: true,
                },
                start: {
                    type: _sequelize.DATEONLY,
                    allowNull: true,
                },
                end: {
                    type: _sequelize.DATEONLY,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorcareer',
                tableName: 'mentorcareer',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorcareer.belongsTo(db.Mentorinfo, { foreignKey: 'mentorkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
