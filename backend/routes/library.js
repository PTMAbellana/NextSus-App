const express = require('express');
const router = express.Router();
const LibraryBorrow = require('../models/LibraryBorrow');
const auth = require('../middleware/auth');

// @route   GET /api/library/borrows
// @desc    Get user's borrowed books
// @access  Private
router.get('/borrows', auth, async (req, res) => {
  try {
    const borrows = await LibraryBorrow.find({ user: req.user.id })
      .populate('user', 'name studentId')
      .sort({ borrowDate: -1 });
    res.json(borrows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/library/borrows
// @desc    Borrow a book
// @access  Private
router.post('/borrows', auth, async (req, res) => {
  try {
    const { bookTitle, bookAuthor, bookIsbn, dueDate } = req.body;

    const borrow = new LibraryBorrow({
      user: req.user.id,
      bookTitle,
      bookAuthor,
      bookIsbn,
      dueDate
    });

    await borrow.save();

    const populatedBorrow = await LibraryBorrow.findById(borrow._id)
      .populate('user', 'name studentId');

    res.json(populatedBorrow);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/library/borrows/:id/return
// @desc    Return a borrowed book
// @access  Private
router.patch('/borrows/:id/return', auth, async (req, res) => {
  try {
    const borrow = await LibraryBorrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrow.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';

    // Calculate fine if overdue
    if (new Date() > new Date(borrow.dueDate)) {
      const daysOverdue = Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24));
      borrow.fine = daysOverdue * 10; // 10 per day
    }

    await borrow.save();

    res.json(borrow);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
