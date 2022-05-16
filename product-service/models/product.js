const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    password: String,
    price: Number,
    created_at : {
        type: Date,
        default: Date.now(),
    },
    updated_at : {
        type: Date,
        default: Date.now(),
    }
});

module.exports = Product = mongoose.model('products', productSchema);