'use strict';

const _sequelize = require('sequelize');

module.exports = class LogReservation extends _sequelize.Model {
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
                    type: _sequelize.ENUM('WAITING', 'REJECTED', 'REAPPLIED', 'REAPPLIED_REQUEST', 'CONFIRMED', ''),
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
                timestamps: false,
                modelName: 'Log_reservation',
                tableName: 'log_reservation',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.LogReservation.belongsTo(db.Reservation, { foreignKey: 'reservation_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
