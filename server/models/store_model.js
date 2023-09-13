const mongoose = require('mongoose');

const Store = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    store_name: {
        type: String,
        required: true,
        unique: true
    },
    store_id: {
        type: String,
        required: true,
        unique: true
    },
    registration_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Store', Store);