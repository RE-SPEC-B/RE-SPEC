'use strict';

const _sequelize = require('sequelize');

module.exports = class Portfoliorecommendation extends _sequelize.Model {
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
                recommendation: {
                    type: _sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Portfoliorecommendation',
                tableName: 'portfoliore_commendation',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Portfoliorecommendation.belongsTo(db.Portfolio, { foreignKey: 'portfolio_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
