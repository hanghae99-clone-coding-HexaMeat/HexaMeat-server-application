const mongoose = require('mongoose');

const { Schema } = mongoose;

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    option: {
        type: Array,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

CartSchema.virtual('cartId').get(function () {
    return this._id.toHexString();
});

CartSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('cart', CartSchema);
