const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔌 Testing MongoDB connection...');
        console.log('Connection string:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Database name:', mongoose.connection.name);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check if your MongoDB Atlas cluster is running');
        console.log('2. Verify your IP is whitelisted in MongoDB Atlas');
        console.log('3. Check your connection string in .env file');
        console.log('4. Make sure your internet connection is stable');
    } finally {
        process.exit(0);
    }
}

testConnection();
