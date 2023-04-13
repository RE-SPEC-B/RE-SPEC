'use strict';

const _sequelize = require('sequelize');

module.exports = class Portfolio extends _sequelize.Model {
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
                url: {
                    type: _sequelize.STRING(100),
                    allowNull: true,
                },
                announcement: {
                    type: _sequelize.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Portfolio',
                tableName: 'portfolio',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Portfolio.belongsTo(db.Mentorinfo, { foreignKey: 'mentor_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Portfolio.hasMany(db.Portfoliopreview, { foreignKey: 'portfolio_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Portfolio.hasMany(db.Portfolioprogress, { foreignKey: 'portfolio_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Portfolio.hasMany(db.Portfoliorecommendation, { foreignKey: 'portfolio_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
