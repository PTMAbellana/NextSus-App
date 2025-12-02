import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, MapPin, User, Calendar, ArrowLeft } from 'lucide-react';

const Library = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');

  const books = [
    { id: '1', title: 'Data Structures and Algorithms', author: 'Mark Allen Weiss', isbn: '978-0132576277', status: 'available', copies: 3, location: 'CS-A-204' },
    { id: '2', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', status: 'available', copies: 2, location: 'CS-B-105' },
    { id: '3', title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', status: 'borrowed', copies: 0, location: 'CS-A-301' },
    { id: '4', title: 'Introduction to Algorithms', author: 'Cormen et al.', isbn: '978-0262033848', status: 'available', copies: 4, location: 'CS-A-210' },
    { id: '5', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', isbn: '978-0135957059', status: 'reserved', copies: 1, location: 'CS-B-112' },
    { id: '6', title: 'Operating System Concepts', author: 'Silberschatz', isbn: '978-1118063330', status: 'available', copies: 5, location: 'CS-C-150' },
  ];

  const seats = [
    { id: 'Q1', zone: 'Quiet Zone', number: 1, status: 'occupied', type: 'Individual' },
    { id: 'Q2', zone: 'Quiet Zone', number: 2, status: 'available', type: 'Individual' },
    { id: 'Q3', zone: 'Quiet Zone', number: 3, status: 'available', type: 'Individual' },
    { id: 'Q4', zone: 'Quiet Zone', number: 4, status: 'reserved', type: 'Individual' },
    { id: 'C1', zone: 'Collaborative', number: 1, status: 'available', type: 'Group' },
    { id: 'C2', zone: 'Collaborative', number: 2, status: 'occupied', type: 'Group' },
    { id: 'C3', zone: 'Collaborative', number: 3, status: 'available', type: 'Group' },
    { id: 'R1', zone: 'Reading Room', number: 1, status: 'available', type: 'Individual' },
    { id: 'R2', zone: 'Reading Room', number: 2, status: 'available', type: 'Individual' },
    { id: 'R3', zone: 'Reading Room', number: 3, status: 'occupied', type: 'Individual' },
  ];

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  const availableSeats = seats.filter(s => s.status === 'available').length;
  const availableBooks = books.filter(b => b.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl mb-2 font-bold">University Library</h2>
            <p className="text-gray-600">Browse books and reserve study seats</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl text-purple-600 mb-1 font-bold">{availableBooks}</div>
            <div className="text-sm text-gray-600">Books Available</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl text-blue-600 mb-1 font-bold">{books.length}</div>
            <div className="text-sm text-gray-600">Total Catalog</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl text-green-600 mb-1 font-bold">{availableSeats}</div>
            <div className="text-sm text-gray-600">Seats Available</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="text-2xl text-orange-600 mb-1 font-bold">{seats.length}</div>
            <div className="text-sm text-gray-600">Total Seats</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-1 border border-gray-200 inline-flex">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${
              activeTab === 'books'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Books Catalog</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${
              activeTab === 'seats'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Smart Seats</span>
            </div>
          </button>
        </div>

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Books List */}
            <div className="space-y-3">
              {filteredBooks.map(book => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold">{book.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>{book.author}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              ISBN: {book.isbn}
                            </span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {book.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          book.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : book.status === 'borrowed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {book.status === 'available' ? `${book.copies} Available` :
                         book.status === 'borrowed' ? 'All Borrowed' : 'Reserved'}
                      </span>
                      <button
                        disabled={book.status === 'borrowed'}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
                          book.status === 'borrowed'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {book.status === 'borrowed' ? 'Unavailable' : 'Borrow'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seats Tab */}
        {activeTab === 'seats' && (
          <div className="space-y-4">
            {/* Zone Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {['Quiet Zone', 'Collaborative', 'Reading Room'].map(zone => {
                const zoneSeats = seats.filter(s => s.zone === zone);
                const available = zoneSeats.filter(s => s.status === 'available').length;

                return (
                  <div key={zone} className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="mb-2 font-semibold">{zone}</h4>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl text-green-600 font-bold">{available}</div>
                        <div className="text-sm text-gray-600">available</div>
                      </div>
                      <div className="text-sm text-gray-500">of {zoneSeats.length}</div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${(available / zoneSeats.length) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seats Grid */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="mb-4 font-semibold text-lg">Available Seats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {seats.map(seat => (
                  <button
                    key={seat.id}
                    disabled={seat.status !== 'available'}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      seat.status === 'available'
                        ? 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400'
                        : seat.status === 'occupied'
                        ? 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                        : 'border-yellow-200 bg-yellow-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1 font-bold">{seat.id}</div>
                      <div className="text-xs text-gray-600 mb-2">{seat.zone}</div>
                      <div
                        className={`w-3 h-3 rounded-full mx-auto ${
                          seat.status === 'available'
                            ? 'bg-green-500'
                            : seat.status === 'occupied'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <h4 className="mb-1 font-semibold">Smart Seat Booking</h4>
                  <p>
                    Reserve a seat for up to 4 hours. Similar to WinSpace, PIR sensors monitor 
                    occupancy to ensure efficient use of library spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
