const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Producer = require('./producerdb')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5172;

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
        res.status(200).json({ 
            message: 'Login successful!', 
            userId: user.id,
            name: user.name,
            authMethods: user.authMethods
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

    res.status(200).json({
        message: 'Google authentication successful!',
        userId: user.id,
        name: user.name,
        authMethods: user.authMethods,
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});