const express = require('express');
const router = express.Router();
const registerValidator = require('../middlewares/registerValidator');
const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');

// 회원가입
router.post('/register', registerValidator, async (req, res) => {
    const { id, password, nickname } = req.body;
});

// 로그인
router.post('/login', async (req, res) => {});

module.exports = router;
