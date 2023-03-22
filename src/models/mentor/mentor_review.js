'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorreview extends _sequelize.Model {
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
                content: {
                    type: _sequelize.STRING(255),
                    allowNull: false,
                },
                score: {
                    type: _sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Mentorreview',
                tableName: 'mentorreview',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Mentorreview.belongsTo(db.Mentorinfo, { foreignKey: 'mentorkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.User, { foreignKey: 'userkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.Mentorproduct, { foreignKey: 'productkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.Mentorevaluation, { foreignKey: 'evaluationkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
