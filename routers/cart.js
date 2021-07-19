const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

//조회
router.get('/', async (req, res) => {
    const { userId } = res.locals.user;

    const productsInCart = await Cart.find({ userId }).lean({ virtuals: true });

    // 각 product들에 productId 이용해서 정보 추가
    if (productsInCart.length > 0) {
        for (product of productsInCart) {
            const productFromProductDB = await Product.findById(
                product.productId
            );
            product.title = productFromProductDB.title;
            product.price = productFromProductDB.price;
            product.image = productFromProductDB.image;
            product.priceStandard = productFromProductDB.priceStandard;
            product.price = productFromProductDB.price;
        }
    }

    const cartCount = productsInCart.length;

    // 반환
    res.send({ products: productsInCart, cartCount });
});

//추가
router.post('/', async (req, res) => {
    const { productId, productOption } = req.query;
    const { quantity } = req.body;
    const { userId } = res.locals.user;

    // 진짜 존재하는 상품인지 확인
    const isThisProductExist = await Product.findById(productId);

    // 상품이 존재하지 않거나, 해당 옵션이 존재하지 않으면
    // 에러
    if (
        !isThisProductExist ||
        !isThisProductExist.productOption.includes(productOption)
    ) {
        res.status(400).send({
            errorMessage: '존재하지 않는 상품 또는 옵션입니다.',
        });
        return;
    }

    // Cart에 추가할건데,
    // productId, option 동시에 만족하는걸 찾아서,
    // 존재하면 거기다가 quantity만큼 수량 Up
    // 존재하지 않으면 그냥 새로 추가

    const productInCart = await Cart.findOne({ productId, productOption });

    if (productInCart) {
        // 이미 같은 옵션을 가진 같은 제품이 있을 경우
        const cartIdOfProductInCart = productInCart.cartId;
        // 그 제품의 갯수를 늘린다
        await Cart.findByIdAndUpdate(cartIdOfProductInCart, {
            $inc: { quantity },
        });
    } else {
        // 없을 경우 그냥 새로 추가
        await Cart.create({ userId, productId, productOption, quantity });
    }

    res.send({});
});

//수정
router.patch('/', async (req, res) => {
    const { cartId, action } = req.query;
    const { userId } = res.locals.user;
    console.log(req.query);

    const cart = await Cart.findOne({ _id: cartId, userId });
    const product = await Product.findOne({ _id: cart.productId });

    //쿼리로  action 값을 받고,
    //action이 plus이면 수량을 1 추가
    //action이 minus이면 수량을 1 감소
    console.log(cart);

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

    res.status(200).send({ totalPrice }); //장바구니에 담긴 제품의 가격 * 수량
});

//삭제
router.delete('/', async (req, res) => {
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
