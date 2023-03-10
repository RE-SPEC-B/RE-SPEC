'use strict';

const _sequelize = require('sequelize');

module.exports = class Reservation extends _sequelize.Model {
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
                status: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
                duration: {
                    type: _sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                start: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
                proposed_start1: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
                proposed_start2: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
                proposed_start3: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
                link: {
                    type: _sequelize.TEXT,
                    allowNull: true,
                },
                question: {
                    type: _sequelize.TEXT,
                    allowNull: true,
                },
                createdAt: {
                    type: _sequelize.DATE,
                    defaultValue: _sequelize.NOW,
                    allowNull: false,
                },
                updatedAt: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Reservation',
                tableName: 'reservation',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    // 다른 모델과의 관계
    static associate(db) {
        db.Reservation.belongsTo(db.User, { foreignKey: 'userkey', targetKey: 'id' });
        db.Reservation.belongsTo(db.Mentorinfo, { foreignKey: 'mentorkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
