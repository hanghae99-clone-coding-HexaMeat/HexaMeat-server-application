const app = require('../app');
const supertest = require('supertest');
const User = require('../models/user');
const mongoose = require('mongoose');

test('회원가입 시 아이디는 알파벳 대소문자, 숫자로 이루어져야 한다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'qweqwe',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );

    response = await supertest(app).post('/user/register').send({
        id: '123123',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(201);
});

test('회원가입 시 아이디는 5자 이상 30자 이하여야 한다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'q1w2',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwe123456789012345678901234567890',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(201);
});

test('회원가입 시 아이디 또는 닉네임은 중복될 수 없다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(201);

    response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg1',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '이미 존재하는 아이디 또는 닉네임입니다.'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwer12345',
        password: 'ewq321',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '이미 존재하는 아이디 또는 닉네임입니다.'
    );
});

test('회원가입 시 아이디는 5자 이상 30자 이하여야 한다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq123456789012345678901234567890',
        confirmPassword: 'ewq123456789012345678901234567890',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );
});

test('회원가입 시 비밀번호와 비밀번호 재입력은 일치해야 한다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq321',
        confirmPassword: 'ewq3214',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'ewq3214',
        confirmPassword: 'ewq321',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '요청한 형식이 올바르지 않습니다'
    );
});

test('회원가입 시 비밀번호에 ID 또는 닉네임이 포함되어서는 안된다.', async () => {
    let response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'qwer1234',
        confirmPassword: 'qwer1234',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '비밀번호에는 아이디 또는 닉네임이 포함되지 않도록 설정해주세요.'
    );

    response = await supertest(app).post('/user/register').send({
        id: 'qwer1234',
        password: 'opgg123',
        confirmPassword: 'opgg123',
        nickname: 'opgg',
    });

    expect(response.status).toEqual(400);
    expect(response.body.errorMessage).toEqual(
        '비밀번호에는 아이디 또는 닉네임이 포함되지 않도록 설정해주세요.'
    );
});

afterEach(async () => {
    await User.deleteOne({ id: 'qwer1234' });
});

afterAll(async () => {
    await mongoose.connection.close();
});
