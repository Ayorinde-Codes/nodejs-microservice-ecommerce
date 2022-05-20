const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        { 
            productId: String,
        }
    ],
    user: String,
    total_price: Number,
    created_at : {
        type: Date,
        default: Date.now(),
    },
    updated_at : {
        type: Date,
        default: Date.now(),
    }
});

module.exports = Order = mongoose.model('orders', orderSchema);