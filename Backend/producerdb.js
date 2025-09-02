const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://prasathramakrishnan005_db_user:w2sHRgxAitPaBvoD@farm-fresh.v7dgiuo.mongodb.net/?retryWrites=true&w=majority&appName=farm-fresh';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));


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