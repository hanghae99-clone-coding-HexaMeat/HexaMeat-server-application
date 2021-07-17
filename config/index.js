const mongoose = require('mongoose');

// mongodb://test:test@localhost:27017/HexaMeatDB?authSource=admin

const connect = () => {
    mongoose
        .connect('mongodb://localhost:27017/HexaMeatDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            ignoreUndefined: true,
            useFindAndModify: false,
        })
        .catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
