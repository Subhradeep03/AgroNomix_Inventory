const mongoose = require('mongoose');
const Products = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    store_id: {
        type: mongoose.ObjectId,
        ref: "Store",
        required: true,
    }
})


module.exports = mongoose.model('Products', Products);