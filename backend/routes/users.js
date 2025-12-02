const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/me
// @desc    Update current user
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const { name, gpa } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, gpa },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/carbon
// @desc    Update carbon saved
// @access  Private
router.post('/carbon', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const user = await User.findById(req.user.id);
    user.carbonSaved += amount;
    await user.save();

    res.json({ carbonSaved: user.carbonSaved });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
