const User = require('../models/user');
const Joi = require('joi');

// Joi Validator
const registerValidation = Joi.object({
    id: Joi.string()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{5,30}$'))
        .required(), // 5자 ~ 30자, 영어와 숫자만 허용

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{5,30}$'))
        .required(), //5자 ~ 30자, 영어와 숫자만 허용

    confirmPassword: Joi.ref('password'),

    nickname: Joi.string().min(3).max(30).required(), // 3자 ~ 30자
}).with('password', 'confirmPassword');

// 미들웨어 본체
module.exports = async (req, res, next) => {
    try {
        const { id, password, nickname } =
            await registerValidation.validateAsync(req.body);

        if (password.includes(nickname) || password.includes(id)) {
            // 비밀번호에 닉네임 또는 아이디가 포함되어 있을 경우
            res.status(400).send({
                errorMessage:
                    '비밀번호에는 아이디 또는 닉네임이 포함되지 않도록 설정해주세요.',
            });
            return;
        }

        // ID or 닉네임 중복검사
        const isThereSameIdOrNickname = await User.findOne({
            $or: [{ nickname }, { id }],
        });

        if (isThereSameIdOrNickname) {
            res.status(400).send({
                errorMessage: '이미 존재하는 아이디 또는 닉네임입니다.',
            });
            return;
        }

        next();
    } catch (err) {
        res.status(400).send({
            errorMessage: '요청한 형식이 올바르지 않습니다',
        });
        return;
    }
};
