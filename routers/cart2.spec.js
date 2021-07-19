const { TestWatcher } = require('jest');
const supertest = require('supertest')
const app = require('../app');
const { replaceOne } = require('../models/product');
const mongoose = require('mongoose');
const Cart = require('../models/cart')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Indhbm9zczU1YWEiLCJpYXQiOjE2MjY2OTQyODd9.fapIR0f8NUK_hARUEtwNq0kRKxo2o_iyyDIjTny8nW4'

test('장바구니 수정을 하면 수정한 수량을 내보냄', async () => {
    let response = await supertest(app).patch(
        encodeURI('/cart?cartId=60f56813386ff94276c12911&action=plus'))
        .set('authorization', token)
    
    
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(10)

    
})



//patch / query: cartId, action ,   header-token,  status200,   /401 result: 잘못된 접근
//delete / query: cartId , header- token , status200  / 401 errorMessage: '장바구니에 없는 품목임. 잘못된 접근'