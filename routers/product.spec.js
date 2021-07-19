const app = require('../app');
const supertest = require('supertest');
// const User = require('../models/user');
// const Product = require('../models/product')
// const mongoose = require('mongoose');
const { response } = require('../app');

// 로컬에서 진행한 테스트라서 데이터 상태는 상이할 수 있음

test('get 요청시 응답상태', async () => {
    let response = await supertest(app).get('/products').send({});

    expect(response.status).toEqual(200);
});

test('상세페이지 요청 시 해당 상품의 정보를 리턴.', async () => {
    let response = await supertest(app).get(
        encodeURI('/products/detail?productId=60f4dec8f63cc41ddf896902')
    );

    expect(response.body).toEqual(doc);
});

const doc = {
    result: {
        detailImage: [
            'https://firebasestorage.googleapis.com/v0/b/jyg-custom-seoul-app/o/frontend%2Fdescriptions%2Fweb%2Fporkbelly-fresh1.png?alt=media',
            'https://firebasestorage.googleapis.com/v0/b/jyg-custom-seoul-app/o/frontend%2Fdescriptions%2Fweb%2Fporkbelly-fresh2.png?alt=media',
            'https://firebasestorage.googleapis.com/v0/b/jyg-custom-seoul-app/o/frontend%2Fdescriptions%2Fweb%2Fporkfresh.png?alt=media',
        ],
        productInfo: [
            '오늘 받으실 삼겹살의 도축일을 확인하세요',
            ' 0 7 월 1 4 일  ',
            ' 당일배송 기준',
        ],
        productOption: ['보통(16mm)', '얇게(11mm)', '두껍(24mm)'],
        _id: '60f4dec8f63cc41ddf896902',
        title: '초신선 돼지 삼겹살 구이용',
        priceStandard: '기준가 16,800원 (600g)',
        price: 16800,
        freeAntibiotic: false,
        category: '돼지',
        createdAt: '2021-07-19T02:09:12.043Z',
        updatedAt: '2021-07-19T10:24:50.338Z',
        __v: 0,
        bestProduct: false,
        productId: '60f4dec8f63cc41ddf896902',
        id: '60f4dec8f63cc41ddf896902',
    },
};
