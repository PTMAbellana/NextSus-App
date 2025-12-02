const mongoose = require('mongoose');

const LibraryBorrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  bookAuthor: String,
  bookIsbn: String,
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('LibraryBorrow', LibraryBorrowSchema);
