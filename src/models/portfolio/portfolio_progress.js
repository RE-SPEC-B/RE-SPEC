'use strict';

const _sequelize = require('sequelize');

module.exports = class Portfolioprogress extends _sequelize.Model {
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
                progress: {
                    type: _sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Portfolioprogress',
                tableName: 'portfolio_progress',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Portfolioprogress.belongsTo(db.Portfolio, { foreignKey: 'portfolio_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
