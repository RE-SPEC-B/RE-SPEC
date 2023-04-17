'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorproduct extends _sequelize.Model {
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
                product: {
                    type: _sequelize.STRING(50),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorproduct',
                tableName: 'mentor_product',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorproduct.hasOne(db.Mentorreview, { foreignKey: 'product_id', sourceKey: 'id' });
    }
};
