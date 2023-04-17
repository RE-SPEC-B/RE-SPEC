'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorstrength extends _sequelize.Model {
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
                strength: {
                    type: _sequelize.STRING(50),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorstrength',
                tableName: 'mentor_strength',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorstrength.belongsTo(db.Mentorinfo, { foreignKey: 'mentor_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
