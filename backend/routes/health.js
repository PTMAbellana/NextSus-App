const express = require('express');
const router = express.Router();
const HealthAppointment = require('../models/HealthAppointment');
const auth = require('../middleware/auth');

// @route   GET /api/health/appointments
// @desc    Get user's health appointments
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await HealthAppointment.find({ user: req.user.id })
      .populate('user', 'name studentId')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/health/appointments
// @desc    Book health appointment
// @access  Private
router.post('/appointments', auth, async (req, res) => {
  try {
    const { appointmentDate, timeSlot, serviceType, symptoms, notes } = req.body;

    // Generate queue number
    const todayAppointments = await HealthAppointment.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date(appointmentDate).setHours(0, 0, 0)),
        $lt: new Date(new Date(appointmentDate).setHours(23, 59, 59))
      },
      status: { $in: ['scheduled', 'in-progress'] }
    });

    const queueNumber = todayAppointments + 1;

    const appointment = new HealthAppointment({
      user: req.user.id,
      appointmentDate,
      timeSlot,
      serviceType,
      symptoms,
      notes,
      queueNumber
    });

    await appointment.save();

    const populatedAppointment = await HealthAppointment.findById(appointment._id)
      .populate('user', 'name studentId');

    res.json(populatedAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/health/appointments/:id/cancel
// @desc    Cancel health appointment
// @access  Private
router.patch('/appointments/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await HealthAppointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
