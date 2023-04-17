'use strict';

const _sequelize = require('sequelize');

module.exports = class Career extends _sequelize.Model {
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
                company: {
                    type: _sequelize.STRING(20),
                    allowNull: false,
                },
                company_size_enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
                career_enum: {
                    type: _sequelize.STRING(30),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: 'Career',
                tableName: 'career',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Career.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
        db.Career.belongsTo(db.Companysizeinfo, { foreignKey: 'company_size_enum', targetKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade'});
        db.Career.belongsTo(db.Careerinfo, { foreignKey: 'career_enum', targetKey: 'enum', onDelete: 'cascade', onUpdate: 'cascade'});
    }
};
