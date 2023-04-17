'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorinfo extends _sequelize.Model {
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
                title: {
                    type: _sequelize.STRING(50),
                    allowNull: true,
                },
                introduction: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                video: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                mentoring: {
                    type: _sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                correcting: {
                    type: _sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                satisfaction: {
                    type: _sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorinfo',
                tableName: 'mentor_info',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorinfo.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
        db.Mentorinfo.hasOne(db.Portfolio, { foreignKey: 'mentor_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorinfo.hasMany(db.Mentorreview, { foreignKey: 'mentor_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorinfo.hasMany(db.Mentorcareer, { foreignKey: 'mentor_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorinfo.hasMany(db.Mentorstrength, { foreignKey: 'mentor_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorinfo.hasMany(db.Reservation, { foreignKey: 'mentor_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
