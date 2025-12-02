const mongoose = require('mongoose');

const FacultyConsultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facultyName: {
    type: String,
    required: true
  },
  facultyDepartment: String,
  consultDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FacultyConsult', FacultyConsultSchema);
