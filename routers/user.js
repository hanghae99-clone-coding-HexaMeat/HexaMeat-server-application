const express = require('express');
const router = express.Router();
const registerValidator = require('../middlewares/registerValidator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const SECRET_KEY = require('../config/secretKey');

function encryptPassword(password) {
    return SHA256(password).toString();
}

router.post('/register', registerValidator, async (req, res) => {
    let { id, password, nickname } = req.body;

    const encryptedPassword = encryptPassword(password);

    await User.create({ id, password: encryptedPassword, nickname });

    res.status(201).send({});
});

// 로그인
router.post('/login', async (req, res) => {
    let { id, password } = req.body;

    const encryptedPassword = encryptPassword(password);

    const isThisUserExist = await User.findOne({
        id,
        password: encryptedPassword,
    });

    if (!isThisUserExist) {
        res.status(401).send({
            errorMessage: 'ID 또는 비밀번호를 다시 한번 확인해주세요.',
        });
        return;
    }

    const token = jwt.sign({ id: id }, SECRET_KEY);

    res.status(200).send({ token });
});

module.exports = router;
