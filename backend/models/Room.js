const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['classroom', 'study-niche', 'lab', 'meeting-room'],
    default: 'classroom'
  },
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  coordinates: {
    x: Number,
    y: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);
