const mongoose = require('mongoose');

const HealthAppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['general-checkup', 'dental', 'consultation', 'emergency', 'prescription']
  },
  symptoms: String,
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  queueNumber: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthAppointment', HealthAppointmentSchema);
