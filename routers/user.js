const express = require('express');
const router = express.Router();
const registerValidator = require('../middlewares/registerValidator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const SECRET_KEY = require('../config/secretKey');

// 회원가입
router.post('/register', registerValidator, async (req, res) => {
    let { id, password, nickname } = req.body;

    password = SHA256(password).toString(); // 패스워드 암호화

    await User.create({ id, password, nickname });

    const token = jwt.sign({ id: id }, SECRET_KEY); // 추상화할 때 Token 생성하는 함수 따로 만들 수 있을 듯

    res.status(201).send({ token });
});

// 로그인
router.post('/login', async (req, res) => {
    let { id, password } = req.body;

    password = SHA256(password).toString();

    const user = await User.findOne({ id, password });

    if (!user) {
        res.status(401).send({
            errorMessage: 'ID 또는 비밀번호를 다시 한번 확인해주세요.',
        });
        return;
    }

    const token = jwt.sign({ id: id }, SECRET_KEY);

    res.status(200).send({ token });
});

module.exports = router;
