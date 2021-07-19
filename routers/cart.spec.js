const app = require('../app');
const supertest = require('supertest');
const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhcnRzcGVjdGVzdDEyMyIsImlhdCI6MTUxNjIzOTAyMn0.E3zLoH4RHXpMhY6ZoZ0LYca9mMnep_ou7CuMKoJyRH0';

let userId = null;

test('장바구니를 요청하면 물건리스트와 총 갯수를 반환받는다.', async () => {
    let response = await supertest(app)
        .get('/cart')
        .set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(0);
    expect(response.body.cartCount).toEqual(0);

    await supertest(app)
        .post(
            encodeURI(
                '/cart?productId=60f4cfcbeaed353bf0263c61&productOption=두껍(24mm)'
            )
        )
        .set('authorization', token)
        .send({
            quantity: 1,
        });

    response = await supertest(app).get('/cart').set('authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.products[0].productId).toEqual(
        '60f4cfcbeaed353bf0263c61'
    );
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
