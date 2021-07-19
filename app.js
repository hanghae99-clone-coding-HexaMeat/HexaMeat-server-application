const express = require('express');
const app = express();
const connect = require('./config/index');
const mainRouter = require('./routers/index');
const cors = require('cors');

connect();

app.use(cors());

app.use(
    '/',
    express.urlencoded({ extended: false }),
    express.json(),
    mainRouter
);

app.listen(3000, () => {
    console.log('Hi!');
});
