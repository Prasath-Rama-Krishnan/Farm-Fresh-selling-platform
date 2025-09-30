const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Producer = require('./producerdb');

// JWT Secret - use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// In-memory fallback storage for when MongoDB is unavailable
let inMemoryProducers = [];

// Load environment variables
require('dotenv').config();

// MongoDB connection with retry logic and better error handling
const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('✅ Already connected to MongoDB');
        return true;
    }
    
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                throw new Error('MongoDB URI is not defined in environment variables');
            }
            
            console.log(`🔌 Attempting to connect to MongoDB (Attempt ${retryCount + 1}/${maxRetries})...`);
            
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
            });
            
            console.log('✅ Successfully connected to MongoDB!');
            return true;
            
        } catch (error) {
            retryCount++;
            console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error.message);
            
            if (retryCount === maxRetries) {
                console.error('❌ Max retries reached. Running in fallback mode without MongoDB.');
                console.log('ℹ️ To fix MongoDB connection:');
                console.log('1. Go to https://cloud.mongodb.com/');
                console.log('2. Create a new FREE cluster (M0)');
                console.log('3. Add your IP to Network Access (or use 0.0.0.0/0)');
                console.log('4. Create a database user');
                console.log('5. Get connection string and update .env file');
                return false;
            }
            
            // Wait before retrying
            const delay = 2000;
            console.log(`⏳ Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
};

// Check MongoDB connection status
let isMongoConnected = false;

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
    isMongoConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    isMongoConnected = false;
});

// Initialize connection
connectDB().then(connected => {
    isMongoConnected = connected;
});

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        'https://farm-fresh-selling-platform.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongoConnected: isMongoConnected
    });
});

const port = process.env.PORT || 5172;

// Simple in-memory user storage (in production, use a proper database)
const users = [];

// Helper function to find user by email
function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

// Helper function to create or update user
async function createOrUpdateUser(email, password = null, googleId = null, name = null) {
    try {
        // Find existing user
        let user = users.find(u => u.email === email);
        
        if (user) {
            // Update existing user
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            if (googleId) user.googleId = googleId;
            if (name) user.name = name;
            return user;
        } else {
            // Create new user
            const newUser = {
                id: (users.length + 1).toString(),
                email,
                password: null,
                googleId,
                name: name || email.split('@')[0],
                authMethods: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            if (password) {
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);
                newUser.authMethods.push('password');
            }
            if (googleId) newUser.authMethods.push('google');

            users.push(newUser);
            return newUser;
        }
    } catch (error) {
        console.error('Error in createOrUpdateUser:', error);
        throw error;
    }
}

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            if (existingUser.authMethods.includes('password')) {
                return res.status(400).json({ message: 'User already exists with password authentication' });
            } else {
                // User exists with Google only, add password method
                const salt = await bcrypt.genSalt(10);
                existingUser.password = await bcrypt.hash(password, salt);
                existingUser.authMethods.push('password');
                existingUser.updatedAt = new Date();
                
                return res.status(200).json({
                    message: 'Password added to existing Google account!',
                    userId: existingUser.id
                });
            }
        }

        // Create new user with password
        const newUser = await createOrUpdateUser(email, password);
        res.status(201).json({ 
            message: 'User registered successfully!', 
            userId: newUser.id 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = user.password && await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email 
                },
                JWT_SECRET, 
                { 
                    expiresIn: '24h' 
                }
            );

            // Update last login time
            user.lastLogin = new Date();

            return res.status(200).json({
                message: 'Login successful!',
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    authMethods: user.authMethods
                }
            });
        } else if (user && !user.password) {
            return res.status(400).json({
                message: 'This email is registered with Google Sign-In only. Please sign in with Google or set a password.',
                needsPassword: true,
                userId: user.id
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Google Sign-In endpoint
app.post('/google-auth', async(req, res) => {
    const { email, googleId, name } = req.body;

    // Find or create user with Google authentication
    let user = findUserByEmail(email);

    if (user) {
        // Update existing user with Google info
        if (!user.authMethods.includes('google')) {
            user.authMethods.push('google');
        }
        user.googleId = googleId;
        if (name) user.name = name;
    } else {
        // Create new user with Google authentication
        user = createOrUpdateUser(email, null, googleId, name);
    }

    // Generate JWT token for Google auth
    const token = jwt.sign({ userId: user.id, email: user.email },
        JWT_SECRET, { expiresIn: '24h' }
    );

    res.status(200).json({
        message: 'Google authentication successful!',
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            authMethods: user.authMethods
        },
        hasPassword: !!user.password
    });
});

// Set password for Google users
app.post('/set-password', async(req, res) => {
    const { email, password, userId } = req.body;

    const user = findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.id !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    // Add password to existing Google user
    user.password = password;
    if (!user.authMethods.includes('password')) {
        user.authMethods.push('password');
    }

    res.status(200).json({
        message: 'Password set successfully! You can now login with either Google or password.',
        authMethods: user.authMethods
    });
});

app.post('/producer', async(req, res) => {
    const { name, number, address, variety, productName, price, quantity, description, userId, userEmail } = req.body;
    try {
        const newProducer = new Producer({
            name,
            number,
            address,
            variety,
            productName,
            price,
            quantity,
            description,
            userId,
            userEmail
        });
        await newProducer.save();
        res.status(201).json({ message: 'Product saved successfully!' });
    } catch (err) {
        console.error('Error saving product:', err.message);
        res.status(500).json({ error: 'Failed to save product.', details: err.message });
    }
});

app.get('/getproducer', async(req, res) => {
    try {
        const producers = await Producer.find();
        res.status(200).json(producers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch producers.' });
    }
});

app.get('/getproducer/:userId', async(req, res) => {
    const { userId } = req.params;
    try {
        const producers = await Producer.find({ userId: userId });
        res.status(200).json(producers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch producers.' });
    }
});

app.put('/producer/:id', async(req, res) => {
    const { id } = req.params;
    const { productName, price, quantity, description } = req.body;
    try {
        const updatedProducer = await Producer.findByIdAndUpdate(
            id, { productName, price, quantity, description }, { new: true }
        );
        res.status(200).json({ message: 'Product updated successfully!', producer: updatedProducer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product.' });
    }
});

app.delete('/producer/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await Producer.findByIdAndDelete(id);
        res.status(200).json({ message: 'Producer deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete producer.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Export the app for Vercel
module.exports = app;

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);    
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please stop any other servers using this port.`);
    } else {
        console.error('Failed to start server:', err);
    }
    process.exit(1);
});