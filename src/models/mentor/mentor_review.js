'use strict';

const _sequelize = require('sequelize');

module.exports = class Mentorreview extends _sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                // 테이블 필드에 대한 설정
                id: {
                    type: _sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true, // 중복 X
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
                // 테이블 자체에 대한 설정
                sequelize /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */,
                timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
                modelName: 'Mentorreview' /* 모델 이름을 설정. */,
                tableName: 'mentorreview' /* 데이터베이스의 테이블 이름. */,
                charset: 'utf8' /* 인코딩 */,
                collate: 'utf8_general_ci',
            },
        );
    }

    // 다른 모델과의 관계
    static associate(db) {
        db.Mentorreview.belongsTo(db.Mentorinfo, { foreignKey: 'mentorkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.User, { foreignKey: 'userkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.Mentorproduct, { foreignKey: 'productkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Mentorreview.belongsTo(db.Mentorevaluation, { foreignKey: 'evaluationkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
    }
};
