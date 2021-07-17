const express = require('express');
const userRouter = require('./user');
const productRouter = require('./product');
const cartRouter = require('./cart');
const router = express.Router();
const auth = require('../middlewares/auth-Middleware')

router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/cart', auth, cartRouter);

module.exports = router;
