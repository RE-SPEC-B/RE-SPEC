'use strict';

const _sequelize = require('sequelize');

module.exports = class Education extends _sequelize.Model {
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
                university: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
                education_enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Education',
                tableName: 'education',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Education.belongsTo(db.Educationinfo, { foreignKey: 'education_enum', targetKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade'});
        db.Education.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
    }
};
