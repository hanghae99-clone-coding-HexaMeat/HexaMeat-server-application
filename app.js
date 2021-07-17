const express = require('express');
const app = express();
const connect = require('./config/index');

connect();

app.listen(3000, () => {
    console.log('Hi!');
})
