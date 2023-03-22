'use strict';

const _sequelize = require('sequelize');

module.exports = class User extends _sequelize.Model {
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
                username: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
                profile: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                email: {
                    type: _sequelize.STRING(30),
                    allowNull: true,
                    unique: true,
                },
                password: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                introduction: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                phonenum: {
                    type: _sequelize.STRING(20),
                    allowNull: true,
                },
                position: {
                    type: _sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'mentee',
                },
                mbti: {
                    type: _sequelize.STRING(10),
                    allowNull: true,
                },
                provider: {
                    type: _sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'local',
                },
                snsId: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                fcm: {
                    type: _sequelize.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'User',
                tableName: 'user',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.User.belongsToMany(db.User, { through: 'follow', as: 'Follower', foreignKey: 'followerid' });
        db.User.belongsToMany(db.User, { through: 'follow', as: 'Following', foreignKey: 'followingid' });
        db.User.belongsToMany(db.Job, { through: 'user_job' });
        db.User.belongsToMany(db.Characteristic, { through: 'user_characteristic' });
        db.User.hasOne(db.Career, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasOne(db.Education, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasOne(db.Mentorinfo, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasMany(db.Mentorreview, { foreignKey: 'userkey', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.User.hasMany(db.Reservation, { foreignKey: 'userkey', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
