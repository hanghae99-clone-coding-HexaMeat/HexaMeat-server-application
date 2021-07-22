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
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 1,
            productOption: '두껍(24mm)',
        });

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(productId);
    expect(response.body.cartCount).toEqual(1);
});

test('장바구니에 상품을 추가할 시 기존에 들어있던 상품이라면 갯수를 더한다.', async () => {
    let response = await supertest(app)
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 1,
            productOption: '두껍(24mm)',
        });

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(productId);
    expect(response.body.cartCount).toEqual(1);

    response = await supertest(app)
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 5,
            productOption: '두껍(24mm)',
        });

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(6);
    expect(response.body.cartCount).toEqual(1);
});

test('같은 상품명이라도 옵션이 다르면 다른 상품으로서 장바구니에 추가된다.', async () => {
    let response = await supertest(app)
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 3,
            productOption: '두껍(24mm)',
        });

    expect(response.status).toEqual(200);

    response = await supertest(app)
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 5,
            productOption: '보통(16mm)',
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
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 1,
            productOption: '두껍(24mm)',
        });

    expect(response.status).toEqual(200);

    response = await supertest(app)
        .post(encodeURI('/cart?productId=60ee89ca73e8b33dec17a6bf'))
        .set('authorization', token)
        .send({
            quantity: 1,
            productOption: '두껍(24mm)',
        });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '존재하지 않는 상품 또는 옵션입니다.'
    );

    response = await supertest(app)
        .post(encodeURI(`/cart?productId=${productId}`))
        .set('authorization', token)
        .send({
            quantity: 1,
            productOption: '안두껍(1mm)',
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

test('장바구니 수정 요청은 action에 따라 갯수를 1 증가 또는 감소시킨다.', async () => {
    const productInCart = await Cart.create({
        userId,
        productId: '60f58e6890396a1964b46cce',
        productOption: '요리용(1+)',
        quantity: 3,
    });

    await supertest(app)
        .patch(encodeURI(`/cart?cartId=${productInCart.cartId}&action=plus`))
        .set('authorization', token);

    let response = await supertest(app)
        .get('/cart')
        .set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(4);

    await supertest(app)
        .patch(encodeURI(`/cart?cartId=${productInCart.cartId}&action=minus`))
        .set('authorization', token);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(3);
});

test('장바구니 수정 요청 시 action은 plus 또는 minus여야 한다.', async () => {
    const productInCart = await Cart.create({
        userId,
        productId: '60f58e6890396a1964b46cce',
        productOption: '요리용(1+)',
        quantity: 3,
    });

    let response = await supertest(app)
        .patch(encodeURI(`/cart?cartId=${productInCart.cartId}&action=plzplus`))
        .set('authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('잘못된 접근입니다.');

    response = await supertest(app)
        .patch(
            encodeURI(`/cart?cartId=${productInCart.cartId}&action=plzminus`)
        )
        .set('authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('잘못된 접근입니다.');

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].quantity).toEqual(3);
});

test('장바구니 수정 요청 시 수정하려는 상품이 존재하지 않을 경우 에러를 띄운다.', async () => {
    const productInCart = await Cart.create({
        userId,
        productId: '60f58e6890396a1964b46ccd',
        productOption: '요리용(1+)',
        quantity: 3,
    });

    let response = await supertest(app)
        .patch(encodeURI(`/cart?cartId=${productInCart.cartId}&action=plus`))
        .set('authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('존재하지 않는 상품입니다.');

    response = await supertest(app)
        .patch(encodeURI(`/cart?cartId=${productInCart.cartId}&action=minus`))
        .set('authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('존재하지 않는 상품입니다.');
});

test('장바구니 항목 삭제 요청 시 해당 유저인지 확인 후 삭제한다.', async () => {
    const productInCart = await Cart.create({
        userId,
        productId: '60f58e6890396a1964b46cce',
        productOption: '요리용(1+)',
        quantity: 3,
    });

    let response = await supertest(app)
        .delete(`/cart?cartId=${productInCart.cartId}`)
        .set('authorization', token);

    expect(response.status).toEqual(200);

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(0);
});

test('장바구니 항목 삭제 요청 시 다른 유저일 경우 에러를 띄운다.', async () => {
    const productInCart = await Cart.create({
        userId,
        productId: '60f58e6890396a1964b46cce',
        productOption: '요리용(1+)',
        quantity: 3,
    });

    await User.create({
        id: 'starkindustry123',
        password: 'testspeccart321',
        confirmPassword: 'testspeccart321',
        nickname: 'starkindustry123',
    });

    const tokenStark =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN0YXJraW5kdXN0cnkxMjMifQ.CcK_jazw8WIMytqhfm2QfBmPiPS1j8OULwzFl7KPYq4';

    let response = await supertest(app)
        .delete(`/cart?cartId=${productInCart.cartId}`)
        .set('authorization', tokenStark);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('잘못된 접근입니다.');

    await User.deleteOne({ id: 'starkindustry123' });
});

test('장바구니에 없는 항목을 삭제 요청할 시 에러를 띄운다.', async () => {
    // const productInCart = await Cart.create({
    //     userId,
    //     productId: '60f58e6890396a1964b46cce',
    //     productOption: '요리용(1+)',
    //     quantity: 3,
    // });

    let response = await supertest(app)
        .delete(`/cart?cartId=60f58e6890396a1964b46ccd`)
        .set('authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual('잘못된 접근입니다.');
});

beforeEach(async () => {
    user = await User.create({
        id: 'cartspectest123',
        password: 'testspeccart321',
        confirmPassword: 'testspeccart321',
        nickname: 'cartspectester',
    });

    userId = user.userId;
});

afterEach(async () => {
    await User.deleteOne({ id: 'cartspectest123' });
    await Cart.deleteMany({ userId });
});

afterAll(async () => {
    await mongoose.connection.close();
});
