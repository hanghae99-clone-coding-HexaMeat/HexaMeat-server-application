const app = require('../app');
const supertest = require('supertest');
const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhcnRzcGVjdGVzdDEyMyIsImlhdCI6MTUxNjIzOTAyMn0.E3zLoH4RHXpMhY6ZoZ0LYca9mMnep_ou7CuMKoJyRH0';

let userId = null;

const productId = '60f58e3990396a1964b46c98';

test('장바구니를 요청하면 물건리스트와 총 갯수를 반환받는다.', async () => {
    let response = await supertest(app)
        .get('/cart')
        .set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(0);
    expect(response.body.cartCount).toEqual(0);

    await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=두껍(24mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(productId);
    expect(response.body.cartCount).toEqual(1);
});

test('장바구니에 상품을 추가할 시 기존에 들어있던 상품이라면 갯수를 더한다.', async () => {
    let response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=두껍(24mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(productId);
    expect(response.body.cartCount).toEqual(1);

    response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=두껍(24mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 5,
        });

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(6);
    expect(response.body.cartCount).toEqual(1);
});

test('같은 상품명이라도 옵션이 다르면 다른 상품으로서 장바구니에 추가된다.', async () => {
    let response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=두껍(24mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 3,
        });

    expect(response.status).toEqual(200);

    response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=보통(16mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 5,
        });

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(3);
    expect(response.body.products[1].quantity).toEqual(5);
    expect(response.body.cartCount).toEqual(2);
});

test('존재하지 않는 상품 또는 옵션은 장바구니에 추가할 수 없다.', async () => {
    let response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=두껍(24mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    expect(response.status).toEqual(200);

    response = await supertest(app)
        .post(
            encodeURI(
                '/cart?productId=60ee89ca73e8b33dec17a6bf&productOption=두껍(24mm)'
            )
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '존재하지 않는 상품 또는 옵션입니다.'
    );

    response = await supertest(app)
        .post(
            encodeURI(`/cart?productId=${productId}&productOption=안두껍(1mm)`)
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '존재하지 않는 상품 또는 옵션입니다.'
    );

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(productId);
    expect(response.body.cartCount).toEqual(1);
});

beforeEach(async () => {
    userId = await User.create({
        id: 'cartspectest123',
        password: 'testspeccart321',
        confirmPassword: 'testspeccart321',
        nickname: 'cartspectester',
    }).userId;
});

afterEach(async () => {
    await User.deleteOne({ id: 'cartspectest123' });
    await Cart.deleteMany({ userId });
});

afterAll(async () => {
    await mongoose.connection.close();
});
