'use strict';

const _sequelize = require('sequelize');

module.exports = class Log_reservation extends _sequelize.Model {
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
                status_from: {
                    type: _sequelize.ENUM('WAITING', 'REJECTED', 'REAPPLIED', 'REAPPLIED_REQUEST', 'CONFIRMED'),
                    allowNull: false,
                    defaultValue: 'WAITING',
                },
                status_to: {
                    type: _sequelize.ENUM('WAITING', 'REJECTED', 'REAPPLIED', 'REAPPLIED_REQUEST', 'CONFIRMED'),
                    allowNull: false,
                    defaultValue: 'WAITING',
                },
                createdAt: {
                    type: _sequelize.DATE,
                    defaultValue: _sequelize.NOW,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Log_reservation',
                tableName: 'log_reservation',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Log_reservation.belongsTo(db.Reservation, { foreignKey: 'reservationkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
