const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = require('../config/secretKey');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

    try {
        const { nickname } = jwt.verify(tokenValue, secretKey);
        const foundUser = await User.findOne({ nickname });
        if (!foundUser) {
            throw new Error('존재하지 않는 유저입니다.');
        }
        res.locals.user = foundUser;
        next();
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }
};
