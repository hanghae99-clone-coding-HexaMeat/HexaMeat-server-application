const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

//조회
router.get('/', async (req, res) => {});

//추가
router.post('/', async (req, res) => {});

//수정
router.patch('/cart', async (req, res) => {
    const { cartId, action } = req.query;
    const cart = await Cart.findOne({ _id: cartId });
    const product = await Product.findOne({ _id: cart.productId });

    if (action === 'plus') {
        cart.quantity += 1;
        cart.save();
    } else if (action === 'minus') {
        cart.quantity -= 1;
        cart.save();
    } else {
        res.status(401).send({ result: '잘못된 접근' });
    }

    const totalPrice = cart.quantity * product.price;
    // const { quantity } = cart.quantity
    // const { price } = product.price
    // const totalPrice = quantity * price;

    res.status(200).send({ totalPrice });
});

//삭제
router.delete('/cart', async (req, res) => {
    const { cartId } = req.query;
    try {
        await Cart.deleteOne({ _id: cartId });
        res.status(200).send({ result: '삭제' });
    } catch (error) {
        res.status(401).send({
            errorMessage: '장바구니에 없는 품목임. 잘못된 접근',
        });
    }
});

module.exports = router;
