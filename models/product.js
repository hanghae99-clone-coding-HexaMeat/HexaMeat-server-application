const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    imgArr: {
        type: Array,
        required: true,
    },
    detailDesc: {
        type: String,
        required: true,
    },
});

productSchema.virtual('productId').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Product', productSchema);
