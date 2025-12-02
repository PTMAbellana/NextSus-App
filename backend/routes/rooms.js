const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// @route   GET /api/rooms
// @desc    Get all rooms
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { building, floor, type, status } = req.query;
    
    let query = {};
    if (building) query.building = building;
    if (floor) query.floor = floor;
    if (type) query.type = type;
    if (status) query.status = status;

    const rooms = await Room.find(query).sort({ building: 1, floor: 1, name: 1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rooms/:id
// @desc    Get room by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, building, floor, capacity, type, amenities, coordinates } = req.body;

    const room = new Room({
      name,
      building,
      floor,
      capacity,
      type,
      amenities,
      coordinates
    });

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, building, floor, capacity, type, amenities, status, coordinates } = req.body;

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { name, building, floor, capacity, type, amenities, status, coordinates },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
