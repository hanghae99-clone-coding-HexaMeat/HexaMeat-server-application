const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = require('../config/secretKey');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (!authorization || tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

    try {
        const { id } = jwt.verify(tokenValue, SECRET_KEY);
        const foundUser = await User.findOne({ id });
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
