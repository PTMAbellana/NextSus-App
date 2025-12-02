import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Clock, CheckCircle, AlertCircle, ArrowLeft, Search, X } from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const defaultRooms = [
    { _id: '1', name: 'Room A-101', building: 'Building A', floor: 1, capacity: 30, type: 'classroom', status: 'available', amenities: ['Projector', 'Whiteboard', 'WiFi'] },
    { _id: '2', name: 'Room A-102', building: 'Building A', floor: 1, capacity: 25, type: 'classroom', status: 'occupied', amenities: ['Whiteboard', 'WiFi'] },
    { _id: '3', name: 'Room A-201', building: 'Building A', floor: 2, capacity: 40, type: 'classroom', status: 'available', amenities: ['Projector', 'Audio System', 'WiFi'] },
    { _id: '4', name: 'Room B-101', building: 'Building B', floor: 1, capacity: 15, type: 'study-niche', status: 'available', amenities: ['Whiteboard', 'WiFi'] },
    { _id: '5', name: 'Room B-102', building: 'Building B', floor: 1, capacity: 20, type: 'study-niche', status: 'reserved', amenities: ['WiFi'] },
    { _id: '6', name: 'Lab C-101', building: 'Building C', floor: 1, capacity: 35, type: 'lab', status: 'available', amenities: ['Computers', 'Projector', 'WiFi'] },
    { _id: '7', name: 'Lab C-201', building: 'Building C', floor: 2, capacity: 30, type: 'lab', status: 'occupied', amenities: ['Computers', 'WiFi'] },
    { _id: '8', name: 'Meeting Room D-101', building: 'Building D', floor: 1, capacity: 10, type: 'meeting-room', status: 'available', amenities: ['TV', 'Whiteboard', 'WiFi'] }
  ];

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setRooms(defaultRooms);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleBookRoom = (room) => {
    if (room.status === 'available') {
      setSelectedRoom(room);
    }
  };

  const confirmBooking = async () => {
    try {
      await axios.post('/api/bookings', {
        roomId: selectedRoom._id,
        ...bookingForm
      });
      alert('Room booked successfully!');
      setSelectedRoom(null);
      setBookingForm({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
      });
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    confirmBooking();
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const displayRooms = filteredRooms.length > 0 ? filteredRooms : rooms;
  
  const stats = {
    available: displayRooms.filter(r => r.status === 'available').length,
    occupied: displayRooms.filter(r => r.status === 'occupied').length,
    total: displayRooms.length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'occupied': return 'bg-red-100 text-red-700';
      case 'reserved': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">WinSpace Booking</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms or buildings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.available}</div>
            <div className="text-sm text-white/80">Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.occupied}</div>
            <div className="text-sm text-white/80">Occupied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-white/80">Total Rooms</div>
          </div>
        </div>
      </div>

      {/* Search Criteria */}
      <div className="bg-white p-4 border-b">
        <h3 className="font-semibold mb-3">Search Criteria</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Building</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm">
              <option>All</option>
              <option>Building A</option>
              <option>Building B</option>
              <option>Building C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b overflow-x-auto">
        <div className="flex gap-2">
          {['all', 'classroom', 'study-niche', 'lab', 'meeting-room'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Rooms' : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading rooms...</p>
          </div>
        ) : displayRooms.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No rooms found</p>
          </div>
        ) : (
          displayRooms.map(room => (
            <div
              key={room._id}
              onClick={() => handleBookRoom(room)}
              className={`bg-white rounded-xl p-4 border-l-4 ${
                room.status === 'available' ? 'border-green-500 cursor-pointer hover:shadow-lg' :
                room.status === 'occupied' ? 'border-red-500' :
                'border-yellow-500'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{room.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      room.status === 'available' ? 'bg-green-500' :
                      room.status === 'occupied' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{room.building} • Floor {room.floor}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} seats</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="capitalize">{room.type.replace('-', ' ')}</span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
              <button 
                onClick={() => setSelectedRoom(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-purple-900 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">PIR Sensor Alert</span>
              </div>
              <p className="text-sm text-purple-700">
                This room is equipped with motion sensors. Your booking will be automatically cancelled if no occupancy is detected within 15 minutes.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Date</label>
                <input 
                  type="date" 
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">End Time</label>
                  <input 
                    type="time" 
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Purpose</label>
                <input 
                  type="text" 
                  placeholder="Meeting, Study, Workshop..."
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Attendees</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedRoom.capacity}
                  value={bookingForm.attendees}
                  onChange={(e) => setBookingForm({...bookingForm, attendees: parseInt(e.target.value)})}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Max: {selectedRoom.capacity} people</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="mb-3 font-semibold">Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available - Book now</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Occupied - In use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Reserved - Booked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
