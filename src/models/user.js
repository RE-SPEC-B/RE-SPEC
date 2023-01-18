'use strict';

const _sequelize = require('sequelize');

module.exports = class User extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                // 테이블 필드에 대한 설정
                id: {
                    type: _sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true, // 중복 X
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
            },
            {
                // 테이블 자체에 대한 설정
                sequelize /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */,
                timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
                modelName: 'User' /* 모델 이름을 설정. */,
                tableName: 'user' /* 데이터베이스의 테이블 이름. */,
                charset: 'utf8' /* 인코딩 */,
                collate: 'utf8_general_ci',
            },
        );
    }

    // 다른 모델과의 관계
    static associate(db) {
        db.User.belongsToMany(db.User, { through: 'follow', as: 'Follower', foreignKey: 'followerid' });
        db.User.belongsToMany(db.User, { through: 'follow', as: 'Following', foreignKey: 'followingid' });
        db.User.belongsToMany(db.Job, { through: 'user_job' });
        db.User.belongsToMany(db.Characteristic, { through: 'user_characteristic' });
        db.User.hasOne(db.Career, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasOne(db.Education, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasOne(db.Mentorinfo, { foreignKey: 'userkey', sourceKey: 'id' });
        db.User.hasMany(db.Mentorreview, { foreignKey: 'userkey', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
