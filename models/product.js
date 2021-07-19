const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
    title: String,
    priceStandard: String,
    price: Number,
    image: String,
    freeAntibiotic: Boolean,
    category: String,
    detailImage: Array,
    productInfo: Array,
    productOption: Array,
    bestProduct: Boolean,
});

ProductSchema.virtual('productId').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('product', ProductSchema);
