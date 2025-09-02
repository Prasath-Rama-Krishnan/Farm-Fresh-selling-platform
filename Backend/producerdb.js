const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, with fallback for development
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://prasathramakrishnan005_db_user:w2sHRgxAitPaBvoD@farm-fresh.v7dgiuo.mongodb.net/?retryWrites=true&w=majority&appName=farm-fresh';

// MongoDB connection with better error handling for Vercel
const connectMongoDB = async() => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 1,
                retryWrites: true,
                w: 'majority'
            });
            console.log('✅ MongoDB Atlas connected successfully');
        } else {
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 1,
                retryWrites: true,
                w: 'majority'
            });
            console.log('✅ MongoDB connected with fallback URI');
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't throw error in Vercel environment, let the app continue
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 Continuing without MongoDB in production');
        } else {
            throw err;
        }
    }
};

// Connect to MongoDB
connectMongoDB();


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