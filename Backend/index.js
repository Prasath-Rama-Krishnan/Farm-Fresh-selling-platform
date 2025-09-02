const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Producer = require('./producerdb');

// JWT Secret - use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// In-memory fallback storage for when MongoDB is unavailable
let inMemoryProducers = [];

// MongoDB connection with graceful fallback
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('✅ MongoDB Atlas connected successfully');
            return true;
        } else {
            console.log('⚠️ No MongoDB URI - using in-memory storage');
            return false;
        }
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('🔄 Falling back to in-memory storage');
        return false;
    }
};

// Check if MongoDB is available
let isMongoConnected = false;

connectDB().then(connected => {
    isMongoConnected = connected;
});

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://farm-fresh-selling-platform.vercel.app', 'https://avfarm.vercel.app']
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5172;

// Simple in-memory user storage (in production, use a proper database)
const users = [];

// Helper function to find user by email
function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

// Helper function to create or update user
function createOrUpdateUser(email, password = null, googleId = null, name = null) {
    let user = findUserByEmail(email);
    
    if (user) {
        // Update existing user
        if (password) user.password = password;
        if (googleId) user.googleId = googleId;
        if (name) user.name = name;
        return user;
    } else {
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            googleId,
            name: name || email.split('@')[0],
            authMethods: []
        };
        
        if (password) newUser.authMethods.push('password');
        if (googleId) newUser.authMethods.push('google');
        
        users.push(newUser);
        return newUser;
    }
}

app.post('/register', async(req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        if (existingUser.authMethods.includes('password')) {
            return res.status(400).json({ message: 'User already exists with password authentication' });
        } else {
            // User exists with Google only, add password method
            existingUser.password = password;
            existingUser.authMethods.push('password');
            return res.status(200).json({ 
                message: 'Password added to existing Google account!', 
                userId: existingUser.id 
            });
        }
    }

    // Create new user with password
    const newUser = createOrUpdateUser(email, password);
    res.status(201).json({ message: 'User registered successfully!', userId: newUser.id });
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = findUserByEmail(email);

    if (user && user.password === password) {
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
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
        res.status(400).json({ 
            message: 'This email is registered with Google Sign-In only. Please sign in with Google or set a password.',
            needsPassword: true,
            userId: user.id
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
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
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
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
            id, 
            { productName, price, quantity, description },
            { new: true }
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


// Export the app for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}