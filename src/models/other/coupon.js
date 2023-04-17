'use strict';

const _sequelize = require('sequelize');

module.exports = class Coupon extends _sequelize.Model {
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
                type: {
                    type: _sequelize.ENUM('MT', 'PT', 'ALL'),
                    allowNull: false,
                    defaultValue: 'ALL',
                },
                duration: {
                    type: _sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                start_date: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
                end_date: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Coupon',
                tableName: 'coupon',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    // 다른 모델과의 관계
    static associate(db) {
        db.Coupon.hasMany(db.UserCoupon, { foreignKey: 'coupon_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
