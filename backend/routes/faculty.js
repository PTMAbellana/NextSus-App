const express = require('express');
const router = express.Router();
const FacultyConsult = require('../models/FacultyConsult');
const auth = require('../middleware/auth');

// @route   GET /api/faculty/consults
// @desc    Get user's faculty consultations
// @access  Private
router.get('/consults', auth, async (req, res) => {
  try {
    const consults = await FacultyConsult.find({ user: req.user.id })
      .populate('user', 'name studentId')
      .sort({ consultDate: -1 });
    res.json(consults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/faculty/consults
// @desc    Book faculty consultation
// @access  Private
router.post('/consults', auth, async (req, res) => {
  try {
    const { facultyName, facultyDepartment, consultDate, timeSlot, purpose, location } = req.body;

    // Check for conflicting appointments
    const conflict = await FacultyConsult.findOne({
      facultyName,
      consultDate: new Date(consultDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflict) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const consult = new FacultyConsult({
      user: req.user.id,
      facultyName,
      facultyDepartment,
      consultDate,
      timeSlot,
      purpose,
      location
    });

    await consult.save();

    const populatedConsult = await FacultyConsult.findById(consult._id)
      .populate('user', 'name studentId');

    res.json(populatedConsult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/faculty/consults/:id/cancel
// @desc    Cancel faculty consultation
// @access  Private
router.patch('/consults/:id/cancel', auth, async (req, res) => {
  try {
    const consult = await FacultyConsult.findById(req.params.id);

    if (!consult) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consult.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    consult.status = 'cancelled';
    await consult.save();

    res.json(consult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
