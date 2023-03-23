'use strict';

const _sequelize = require('sequelize');

module.exports = class Portfoliopreview extends _sequelize.Model {
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
                preview: {
                    type: _sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Portfoliopreview',
                tableName: 'portfoliopreview',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Portfoliopreview.belongsTo(db.Portfolio, { foreignKey: 'portfoliokey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
