const mongoose = require('mongoose');

// mongodb://test:test@localhost:27017/awesomeblog?authSource=admin

const connect = () => {
    mongoose
        .connect('mongodb://localhost:27017/hexameattest', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            ignoreUndefined: true,
        })
        .catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
