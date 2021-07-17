const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

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
    productOption: {
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

CartSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model('cart', CartSchema);
