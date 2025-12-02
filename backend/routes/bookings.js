const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get all bookings (user's own or all if admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('room', 'name building floor capacity')
      .populate('user', 'name email studentId')
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'name building floor capacity')
      .populate('user', 'name email studentId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose, attendees } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room is available
    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      date: new Date(date),
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is already booked for this time slot' });
    }

    const booking = new Booking({
      room: roomId,
      user: req.user.id,
      date,
      startTime,
      endTime,
      purpose,
      attendees
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name building floor capacity')
      .populate('user', 'name email studentId');

    res.json(populatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { date, startTime, endTime, purpose, attendees, status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { date, startTime, endTime, purpose, attendees, status },
      { new: true }
    )
      .populate('room', 'name building floor capacity')
      .populate('user', 'name email studentId');

    res.json(updatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/room/:roomId
// @desc    Get bookings for a specific room
// @access  Public
router.get('/room/:roomId', async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = { 
      room: req.params.roomId,
      status: { $in: ['confirmed', 'pending'] }
    };
    
    if (date) {
      query.date = new Date(date);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name studentId')
      .sort({ date: 1, startTime: 1 });

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
