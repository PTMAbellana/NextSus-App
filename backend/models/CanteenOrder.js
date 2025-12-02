const mongoose = require('mongoose');

const CanteenOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    mealName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupTime: Date,
  orderNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CanteenOrder', CanteenOrderSchema);
