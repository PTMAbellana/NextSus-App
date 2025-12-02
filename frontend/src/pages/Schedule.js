import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, X, Coffee, BookOpen, Users, HeartPulse, Car, DoorOpen } from 'lucide-react';
import axios from 'axios';

const Schedule = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const loadAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const [roomBookings, parkingBookings, canteenOrders, libraryBorrows, facultyConsults, healthAppointments] = await Promise.all([
        axios.get('/api/bookings').catch(() => ({ data: [] })),
        axios.get('/api/parking').catch(() => ({ data: [] })),
        axios.get('/api/canteen/orders').catch(() => ({ data: [] })),
        axios.get('/api/library/borrows').catch(() => ({ data: [] })),
        axios.get('/api/faculty/consults').catch(() => ({ data: [] })),
        axios.get('/api/health/appointments').catch(() => ({ data: [] }))
      ]);

      const combined = [
        ...roomBookings.data.map(b => ({ ...b, type: 'room', icon: DoorOpen, color: 'purple' })),
        ...parkingBookings.data.filter(p => p.currentUser).map(p => ({ ...p, type: 'parking', icon: Car, color: 'blue' })),
        ...canteenOrders.data.map(o => ({ ...o, type: 'canteen', icon: Coffee, color: 'orange' })),
        ...libraryBorrows.data.filter(l => l.status === 'borrowed').map(l => ({ ...l, type: 'library', icon: BookOpen, color: 'green' })),
        ...facultyConsults.data.map(f => ({ ...f, type: 'faculty', icon: Users, color: 'indigo' })),
        ...healthAppointments.data.map(h => ({ ...h, type: 'health', icon: HeartPulse, color: 'red' }))
      ];

      setAllBookings(combined);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllBookings();
  }, [loadAllBookings]);

  const cancelItem = async (item) => {
    if (!window.confirm(`Are you sure you want to cancel this ${item.type}?`)) return;
    
    try {
      let endpoint;
      switch(item.type) {
        case 'room':
          endpoint = `/api/bookings/${item._id}`;
          await axios.delete(endpoint);
          break;
        case 'parking':
          endpoint = `/api/parking/${item._id}/release`;
          await axios.post(endpoint);
          break;
        case 'canteen':
          endpoint = `/api/canteen/orders/${item._id}/cancel`;
          await axios.patch(endpoint);
          break;
        case 'library':
          endpoint = `/api/library/borrows/${item._id}/return`;
          await axios.patch(endpoint);
          break;
        case 'faculty':
          endpoint = `/api/faculty/consults/${item._id}/cancel`;
          await axios.patch(endpoint);
          break;
        case 'health':
          endpoint = `/api/health/appointments/${item._id}/cancel`;
          await axios.patch(endpoint);
          break;
        default:
          return;
      }
      alert('Successfully cancelled');
      loadAllBookings();
      setSelectedBooking(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'confirmed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700',
      'completed': 'bg-blue-100 text-blue-700',
      'available': 'bg-green-100 text-green-700',
      'occupied': 'bg-blue-100 text-blue-700',
      'preparing': 'bg-yellow-100 text-yellow-700',
      'ready': 'bg-green-100 text-green-700',
      'borrowed': 'bg-blue-100 text-blue-700',
      'scheduled': 'bg-green-100 text-green-700',
      'in-progress': 'bg-yellow-100 text-yellow-700'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getItemDate = (item) => {
    switch(item.type) {
      case 'room': return item.date;
      case 'parking': return item.updatedAt;
      case 'canteen': return item.pickupTime || item.createdAt;
      case 'library': return item.dueDate;
      case 'faculty': return item.consultDate;
      case 'health': return item.appointmentDate;
      default: return new Date();
    }
  };

  const filteredBookings = filterType === 'all' 
    ? allBookings 
    : allBookings.filter(b => b.type === filterType);

  const upcomingBookings = filteredBookings.filter(b => {
    const itemDate = new Date(getItemDate(b));
    return itemDate >= new Date() && !['cancelled', 'completed', 'returned'].includes(b.status);
  });

  const pastBookings = filteredBookings.filter(b => {
    const itemDate = new Date(getItemDate(b));
    return itemDate < new Date() || ['cancelled', 'completed', 'returned'].includes(b.status);
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Schedule</h1>
        <p className="text-sm text-white/90">All your bookings and appointments</p>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: CalendarIcon },
            { id: 'room', label: 'Rooms', icon: DoorOpen },
            { id: 'parking', label: 'Parking', icon: Car },
            { id: 'canteen', label: 'Canteen', icon: Coffee },
            { id: 'library', label: 'Library', icon: BookOpen },
            { id: 'faculty', label: 'Faculty', icon: Users },
            { id: 'health', label: 'Health', icon: HeartPulse }
          ].map(filter => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filterType === filter.id
                    ? 'bg-white text-green-700 font-medium'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading your schedule...</p>
          </div>
        ) : (
          <>
            {/* Upcoming Bookings */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                Upcoming Bookings
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">No upcoming bookings</p>
                  <p className="text-gray-600 mt-2">Book a space to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map(item => {
                    const Icon = item.icon;
                    const getTitle = () => {
                      switch(item.type) {
                        case 'room': return item.room?.name || 'Room Booking';
                        case 'parking': return `Parking ${item.spotNumber}`;
                        case 'canteen': return `Order #${item.orderNumber}`;
                        case 'library': return item.bookTitle;
                        case 'faculty': return `Consult with ${item.facultyName}`;
                        case 'health': return `Health ${item.serviceType?.replace('-', ' ')}`;
                        default: return 'Booking';
                      }
                    };
                    
                    const getSubtitle = () => {
                      switch(item.type) {
                        case 'room': return `${item.room?.building} • Floor ${item.room?.floor}`;
                        case 'parking': return `${item.zone} • ${item.type}`;
                        case 'canteen': return `${item.items?.length || 0} items • ₱${item.totalAmount}`;
                        case 'library': return `Due: ${formatDate(item.dueDate)}`;
                        case 'faculty': return item.facultyDepartment;
                        case 'health': return `Queue #${item.queueNumber}`;
                        default: return '';
                      }
                    };

                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedBooking(item)}
                        className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-${item.color}-600 transform hover:-translate-y-1`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 text-${item.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg">{getTitle()}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{getSubtitle()}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusColor(item.status)}`}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-700 mb-1">
                              <CalendarIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-gray-600">Date</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{formatDate(getItemDate(item))}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-700 mb-1">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-gray-600">
                                {item.type === 'room' ? 'Time' : 'Type'}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 capitalize">
                              {item.type === 'room' ? `${item.startTime} - ${item.endTime}` : item.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
                  Past & Completed
                </h2>
                <div className="space-y-3">
                  {pastBookings.map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl p-4 shadow-sm opacity-70 border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-base">
                                  {item.type === 'room' ? item.room?.name : 
                                   item.type === 'parking' ? `Parking ${item.spotNumber}` :
                                   item.type === 'canteen' ? `Order #${item.orderNumber}` :
                                   item.type === 'library' ? item.bookTitle :
                                   item.type === 'faculty' ? item.facultyName :
                                   item.type === 'health' ? `Health ${item.serviceType}` : 'Booking'}
                                </h3>
                                <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(item.status)}`}>
                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDate(getItemDate(item))}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Details</h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {selectedBooking.type === 'room' && (
                <>
                  <div className={`bg-gradient-to-r from-${selectedBooking.color}-600 to-${selectedBooking.color}-700 rounded-2xl p-5 text-white`}>
                    <p className="text-sm opacity-90 mb-1">Room</p>
                    <p className="text-2xl font-bold">{selectedBooking.room?.name}</p>
                    <p className="text-sm opacity-90 mt-1">{selectedBooking.room?.building} • Floor {selectedBooking.room?.floor}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-600">Date</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatDate(selectedBooking.date)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-600">Time</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Purpose</p>
                    <p className="text-gray-900">{selectedBooking.purpose}</p>
                  </div>
                </>
              )}
              
              {selectedBooking.type !== 'room' && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Type</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{selectedBooking.type}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                    <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!['cancelled', 'completed', 'returned'].includes(selectedBooking.status) && (
              <button
                onClick={() => cancelItem(selectedBooking)}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Cancel {selectedBooking.type === 'room' ? 'Booking' : selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
                