const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri);
    
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    });

    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        const db = client.db();
        console.log('Database name:', db.databaseName);
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('\nCollections:');
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
        await client.close();
        process.exit(0);
    }
}

testConnection();
