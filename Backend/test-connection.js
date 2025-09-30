require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('Connection String:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
})
.catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
});
