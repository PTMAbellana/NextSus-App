const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const auth = require('../middleware/auth');

// @route   GET /api/parking
// @desc    Get all parking spots
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { zone, type, status } = req.query;
    
    let query = {};
    if (zone) query.zone = zone;
    if (type) query.type = type;
    if (status) query.status = status;

    const parkingSpots = await Parking.find(query)
      .populate('currentUser', 'name studentId')
      .sort({ zone: 1, spotNumber: 1 });
    
    res.json(parkingSpots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/parking/stats
// @desc    Get parking statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const total = await Parking.countDocuments();
    const available = await Parking.countDocuments({ status: 'available' });
    const occupied = await Parking.countDocuments({ status: 'occupied' });
    const reserved = await Parking.countDocuments({ status: 'reserved' });

    res.json({
      total,
      available,
      occupied,
      reserved
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/parking/:id/occupy
// @desc    Occupy a parking spot
// @access  Private
router.post('/:id/occupy', auth, async (req, res) => {
  try {
    const spot = await Parking.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    if (spot.status !== 'available') {
      return res.status(400).json({ message: 'Parking spot is not available' });
    }

    spot.status = 'occupied';
    spot.currentUser = req.user.id;
    spot.updatedAt = Date.now();

    await spot.save();
    
    const updatedSpot = await Parking.findById(spot._id)
      .populate('currentUser', 'name studentId');

    res.json(updatedSpot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/parking/:id/release
// @desc    Release a parking spot
// @access  Private
router.post('/:id/release', auth, async (req, res) => {
  try {
    const spot = await Parking.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    if (spot.currentUser && spot.currentUser.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    spot.status = 'available';
    spot.currentUser = null;
    spot.updatedAt = Date.now();

    await spot.save();

    res.json(spot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
