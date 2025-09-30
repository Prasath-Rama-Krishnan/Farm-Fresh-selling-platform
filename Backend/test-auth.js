require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test user data
const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User'
};

async function testAuth() {
    try {
        // 1. Test MongoDB Connection
        console.log('🔌 Testing MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected successfully!');

        // 2. Test JWT
        console.log('\n🔑 Testing JWT...');
        const token = jwt.sign({ userId: 'test123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('✅ JWT token generated successfully!');
        console.log('   Sample token:', token.substring(0, 30) + '...');

        // 3. Test bcrypt password hashing
        console.log('\n🔒 Testing password hashing...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        console.log('✅ Password hashed successfully!');
        console.log('   Original password:', testUser.password);
        console.log('   Hashed password:', hashedPassword.substring(0, 30) + '...');

        // 4. Test password verification
        const isMatch = await bcrypt.compare(testUser.password, hashedPassword);
        console.log('\n🔍 Testing password verification...');
        console.log(isMatch ? '✅ Password verification successful!' : '❌ Password verification failed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('\n🏁 Tests completed!');
    }
}

testAuth();
