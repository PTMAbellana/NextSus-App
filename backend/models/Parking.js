const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: true,
    unique: true
  },
  zone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['car', 'motorcycle', 'bicycle', 'ev-charging'],
    default: 'car'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  currentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coordinates: {
    x: Number,
    y: Number
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Parking', ParkingSchema);
