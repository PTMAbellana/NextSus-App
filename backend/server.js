const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextsus')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/users', require('./routes/users'));
app.use('/api/canteen', require('./routes/canteen'));
app.use('/api/library', require('./routes/library'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/health', require('./routes/health'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NextSus API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
