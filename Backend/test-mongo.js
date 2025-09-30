require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI);

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Database name:', mongoose.connection.name);
        console.log('MongoDB version:', (await mongoose.connection.db.admin().serverInfo()).version);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('\nTroubleshooting tips:');
        console.log('1. Check if your MongoDB Atlas cluster is running');
        console.log('2. Verify your IP is whitelisted in MongoDB Atlas');
        console.log('3. Check your connection string in .env file');
        console.log('4. Make sure your internet connection is stable');
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

testConnection();
