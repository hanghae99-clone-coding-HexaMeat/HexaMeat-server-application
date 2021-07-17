const express = require('express');
const userRouter = require('./user');
const productRouter = require('./product');
const cartRouter = require('./cart');
const router = express.Router();

router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);

module.exports = router;
