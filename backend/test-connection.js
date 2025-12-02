// Test MongoDB Atlas Connection
const mongoose = require('mongoose');

// Replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://nextsus_admin:MySecurePass123!@nextsus-cluster.7bbtzkr.mongodb.net/nextsus?retryWrites=true&w=majority&appName=nextsus-cluster';

console.log('🔄 Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Atlas connected!');
    console.log('📊 Connection details:');
    console.log('   - Database:', mongoose.connection.db.databaseName);
    console.log('   - Host:', mongoose.connection.host);
    console.log('\n🎉 Your connection string works! You can use it for deployment.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your username and password');
    console.log('2. Make sure you replaced <password> with actual password');
    console.log('3. Verify network access allows 0.0.0.0/0');
    console.log('4. If password has special characters, encode them:');
    console.log('   @ becomes %40');
    console.log('   # becomes %23');
    console.log('   $ becomes %24');
    process.exit(1);
  });

// Give it 10 seconds to connect
setTimeout(() => {
  console.log('⏱️  Connection timeout - check your connection string');
  process.exit(1);
}, 10000);
