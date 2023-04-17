'use strict';

const User = require('../models/user/user');
const { Op } = require('sequelize');

const _bcrypt = require('bcrypt');

/**
 * 사용자로부터 입력받은 정보들을 바탕으로, 비밀번호 암호화 진행 후,
 * 회원가입 로직을 수행하는 함수
 *
 * @param {*} user_name 유저닉네임
 * @param {*} email 유저이메일
 * @param {*} password 비밀번호
 * @param {*} provider 로그인 제공처
 * @returns
 */
exports.register = async (user_name, email, password, provider) => {
    try {
        const hash_password = await _bcrypt.hash(password, 12);
        return await User.create({
            user_name: user_name,
            email: email,
            password: hash_password,
            provider: provider,
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 사용자로부터 입력받은 정보들을 바탕으로, 중복되는 유저가 있는지
 * 확인하고 반환하는 함수
 *
 * @param {*} user_name 유저닉네임
 * @param {*} email 유저이메일
 * @returns
 */
exports.userFind = async (user_name, email) => {
    try {
        return await User.findOne({ where: { [Op.or]: [{ user_name: user_name }, { email: email }] } });
    } catch (err) {
        throw new Error(err);
    }
};
