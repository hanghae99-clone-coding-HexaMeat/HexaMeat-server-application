const express = require('express');
const app = express();
const connect = require('./config/index');
const mainRouter = require('./routers/index');

connect();

app.use('/', mainRouter);

app.listen(3000, () => {
    console.log('Hi!');
});
