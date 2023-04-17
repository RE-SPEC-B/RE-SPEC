'use strict';

const _sequelize = require('sequelize');

module.exports = class Characteristic extends _sequelize.Model {
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
                characteristic: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
                characteristic_enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Characteristic',
                tableName: 'characteristic',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Characteristic.belongsToMany(db.User, { through: 'user_characteristic' });
    }
};
