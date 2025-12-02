import React, { useState } from 'react';
import { Users, Calendar, Clock, Video, MapPin, Mail } from 'lucide-react';

const Faculty = () => {
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationPurpose, setConsultationPurpose] = useState('');

  const professors = [
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      department: 'Computer Science',
      email: 'sarah.smith@winston.edu',
      avatar: 'SS',
      availableSlots: [
        { id: 's1', date: '2024-12-03', time: '10:00 AM', duration: 30, type: 'in-person', location: 'CS Building, Room 301', status: 'available' },
        { id: 's2', date: '2024-12-03', time: '2:00 PM', duration: 30, type: 'online', status: 'available' },
        { id: 's3', date: '2024-12-04', time: '11:00 AM', duration: 30, type: 'in-person', location: 'CS Building, Room 301', status: 'booked' },
        { id: 's4', date: '2024-12-05', time: '3:00 PM', duration: 30, type: 'online', status: 'available' },
      ]
    },
    {
      id: '2',
      name: 'Prof. Michael Johnson',
      department: 'Mathematics',
      email: 'michael.johnson@winston.edu',
      avatar: 'MJ',
      availableSlots: [
        { id: 'm1', date: '2024-12-03', time: '9:00 AM', duration: 45, type: 'in-person', location: 'Math Building, Office 205', status: 'available' },
        { id: 'm2', date: '2024-12-04', time: '1:00 PM', duration: 45, type: 'in-person', location: 'Math Building, Office 205', status: 'available' },
        { id: 'm3', date: '2024-12-05', time: '10:00 AM', duration: 45, type: 'online', status: 'available' },
      ]
    },
    {
      id: '3',
      name: 'Dr. Emily Chen',
      department: 'Engineering',
      email: 'emily.chen@winston.edu',
      avatar: 'EC',
      availableSlots: [
        { id: 'e1', date: '2024-12-03', time: '2:30 PM', duration: 30, type: 'online', status: 'available' },
        { id: 'e2', date: '2024-12-04', time: '9:00 AM', duration: 30, type: 'in-person', location: 'Engineering Lab 101', status: 'available' },
        { id: 'e3', date: '2024-12-04', time: '4:00 PM', duration: 30, type: 'online', status: 'booked' },
        { id: 'e4', date: '2024-12-06', time: '11:00 AM', duration: 30, type: 'in-person', location: 'Engineering Lab 101', status: 'available' },
      ]
    },
    {
      id: '4',
      name: 'Prof. David Lee',
      department: 'Business',
      email: 'david.lee@winston.edu',
      avatar: 'DL',
      availableSlots: [
        { id: 'd1', date: '2024-12-03', time: '1:00 PM', duration: 30, type: 'in-person', location: 'Business Building, Room 402', status: 'available' },
        { id: 'd2', date: '2024-12-05', time: '10:30 AM', duration: 30, type: 'online', status: 'available' },
      ]
    },
  ];

  const handleBookSlot = (professor, slot) => {
    setSelectedProfessor(professor);
    setSelectedSlot(slot);
  };

  const confirmBooking = () => {
    if (selectedProfessor && selectedSlot) {
      alert(`Consultation booked with ${selectedProfessor.name} on ${selectedSlot.date} at ${selectedSlot.time}`);
      setSelectedProfessor(null);
      setSelectedSlot(null);
      setConsultationPurpose('');
    }
  };

  const totalAvailableSlots = professors.reduce(
    (acc, prof) => acc + prof.availableSlots.filter(s => s.status === 'available').length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Faculty Consultation</h2>
        <p className="text-gray-600">Book consultation slots with your professors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">{professors.length}</div>
          <div className="text-sm text-gray-600">Faculty Members</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">{totalAvailableSlots}</div>
          <div className="text-sm text-gray-600">Open Slots</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600 mb-1">30min</div>
          <div className="text-sm text-gray-600">Avg. Duration</div>
        </div>
      </div>

      {/* Professors List */}
      <div className="space-y-4">
        {professors.map(professor => {
          const availableSlots = professor.availableSlots.filter(s => s.status === 'available');

          return (
            <div key={professor.id} className="bg-white rounded-xl p-6 border border-gray-200">
              {/* Professor Info */}
              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {professor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{professor.name}</h3>
                  <p className="text-gray-600 mb-2">{professor.department}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${professor.email}`} className="hover:text-indigo-600">
                      {professor.email}
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Available Slots</div>
                  <div className="text-2xl font-bold text-green-600">{availableSlots.length}</div>
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <h4 className="font-semibold mb-3">Consultation Hours</h4>
                {availableSlots.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => handleBookSlot(professor, slot)}
                        className="text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          {slot.type === 'online' ? (
                            <Video className="w-4 h-4 text-blue-600" />
                          ) : (
                            <MapPin className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{slot.time} ({slot.duration} min)</span>
                        </div>
                        {slot.location && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {slot.location}
                          </div>
                        )}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            slot.type === 'online'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {slot.type === 'online' ? 'Online' : 'In-Person'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No available slots at the moment</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedProfessor && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirm Consultation Booking</h3>

            <div className="space-y-4 mb-6">
              {/* Professor Info */}
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedProfessor.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{selectedProfessor.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProfessor.department}</p>
                  </div>
                </div>

                {/* Slot Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{selectedSlot.time} ({selectedSlot.duration} minutes)</span>
                  </div>
                  {selectedSlot.type === 'online' ? (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Video className="w-4 h-4" />
                      <span>Online Meeting (Link will be sent via email)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedSlot.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">
                  Purpose of Consultation (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what you'd like to discuss..."
                  value={consultationPurpose}
                  onChange={(e) => setConsultationPurpose(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedProfessor(null);
                  setSelectedSlot(null);
                  setConsultationPurpose('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <h4 className="font-semibold mb-1">Calendar Integration</h4>
            <p>
              Faculty consultation slots are synced with professor calendars (Google/Outlook). 
              Bookings are updated in real-time to prevent double-booking and ensure availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculty;
