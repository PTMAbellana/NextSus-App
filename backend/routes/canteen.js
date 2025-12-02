const express = require('express');
const router = express.Router();
const CanteenOrder = require('../models/CanteenOrder');
const auth = require('../middleware/auth');

// @route   GET /api/canteen/orders
// @desc    Get user's canteen orders
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await CanteenOrder.find({ user: req.user.id })
      .populate('user', 'name studentId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/canteen/orders
// @desc    Create canteen order
// @access  Private
router.post('/orders', auth, async (req, res) => {
  try {
    const { items, totalAmount, pickupTime } = req.body;

    const orderNumber = 'ORD' + Date.now().toString().slice(-8);

    const order = new CanteenOrder({
      user: req.user.id,
      items,
      totalAmount,
      pickupTime,
      orderNumber
    });

    await order.save();

    const populatedOrder = await CanteenOrder.findById(order._id)
      .populate('user', 'name studentId');

    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/canteen/orders/:id/cancel
// @desc    Cancel canteen order
// @access  Private
router.patch('/orders/:id/cancel', auth, async (req, res) => {
  try {
    const order = await CanteenOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
