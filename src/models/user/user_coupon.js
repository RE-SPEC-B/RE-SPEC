'use strict';

const _sequelize = require('sequelize');

module.exports = class UserCoupon extends _sequelize.Model {
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
                status: {
                    type: _sequelize.ENUM('UNUSED', 'RESERVED', 'USED'),
                    allowNull: false,
                    defaultValue: 0,
                },
                download_date: {
                    type: _sequelize.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'UserCoupon',
                tableName: 'user_coupon',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.UserCoupon.hasOne(db.Reservation, { foreignKey: 'user_coupon_id', sourceKey: 'id'});
        db.UserCoupon.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.UserCoupon.belongsTo(db.Coupon, { foreignKey: 'coupon_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
