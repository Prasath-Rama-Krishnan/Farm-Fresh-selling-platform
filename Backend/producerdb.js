const mongoose = require('mongoose');

// Note: MongoDB connection is handled in index.js
// This file only exports the schema/model


const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    variety: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: false,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    }
});

const Producer = mongoose.model('Producer', producerSchema);
module.exports = Producer;