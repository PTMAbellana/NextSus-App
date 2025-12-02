import React, { useState } from 'react';
import { HeartPulse, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const Clinic = () => {
  const [isInQueue, setIsInQueue] = useState(false);
  const [myTicket, setMyTicket] = useState(null);
  const [formData, setFormData] = useState({ name: '', reason: 'General Checkup' });

  const queueEntries = [
    { id: '1', name: 'John D.', ticketNumber: 101, reason: 'General Checkup', waitTime: 5, status: 'in-progress' },
    { id: '2', name: 'Sarah M.', ticketNumber: 102, reason: 'Consultation', waitTime: 15, status: 'waiting' },
    { id: '3', name: 'Mike R.', ticketNumber: 103, reason: 'Medical Certificate', waitTime: 25, status: 'waiting' },
    { id: '4', name: 'Emma L.', ticketNumber: 104, reason: 'First Aid', waitTime: 35, status: 'waiting' },
  ];

  const handleJoinQueue = () => {
    if (!formData.name) {
      alert('Please enter your name');
      return;
    }
    const nextTicket = Math.max(...queueEntries.map(e => e.ticketNumber), 100) + 1;
    setMyTicket(nextTicket);
    setIsInQueue(true);
  };

  const handleLeaveQueue = () => {
    setIsInQueue(false);
    setMyTicket(null);
  };

  const currentServing = queueEntries.find(e => e.status === 'in-progress');
  const waitingCount = queueEntries.filter(e => e.status === 'waiting').length;
  const avgWaitTime = Math.round(queueEntries.reduce((acc, e) => acc + e.waitTime, 0) / queueEntries.length);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Health Services</h2>
        <p className="text-gray-600">Digital queue system for non-emergency health services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">{waitingCount}</div>
          <div className="text-sm text-gray-600">In Queue</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">{avgWaitTime}min</div>
          <div className="text-sm text-gray-600">Avg. Wait Time</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600 mb-1">Open</div>
          <div className="text-sm text-gray-600">8AM - 5PM</div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <HeartPulse className="w-8 h-8" />
          <h3 className="text-xl font-bold">Now Serving</h3>
        </div>
        {currentServing ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold mb-2">#{currentServing.ticketNumber}</div>
              <p className="text-blue-100">{currentServing.reason}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Patient</div>
              <div className="text-xl font-semibold">{currentServing.name}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-blue-100">
            <p>No patients currently being served</p>
          </div>
        )}
      </div>

      {/* Join Queue / My Ticket */}
      {!isInQueue ? (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold mb-4">Join Digital Queue</h3>
          <p className="text-gray-600 mb-4">
            Get in line digitally and receive a notification when it's your turn. 
            No need to wait in the clinic waiting area!
          </p>
          
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Reason for Visit</label>
              <select 
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>General Checkup</option>
                <option>Consultation</option>
                <option>Medical Certificate</option>
                <option>First Aid</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleJoinQueue}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <CheckCircle className="w-5 h-5" />
            Join Queue
          </button>
        </div>
      ) : (
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-300">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-green-900 font-bold mb-1">You're in the Queue!</h3>
              <p className="text-sm text-green-800">
                We'll notify you when it's your turn. You can leave this page.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-center mb-3">
              <div className="text-sm text-gray-600 mb-1">Your Ticket Number</div>
              <div className="text-5xl font-bold text-green-600 mb-2">#{myTicket}</div>
              <div className="text-sm text-gray-600">
                {myTicket && currentServing ? myTicket - currentServing.ticketNumber : 0} people ahead of you
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Estimated wait: ~{myTicket && currentServing ? (myTicket - currentServing.ticketNumber) * 10 : 0} minutes</span>
            </div>
          </div>

          <button
            onClick={handleLeaveQueue}
            className="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Leave Queue
          </button>
        </div>
      )}

      {/* Queue List */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold mb-4">Current Queue</h3>
        <div className="space-y-2">
          {queueEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.status === 'in-progress'
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-xl font-bold ${
                  entry.status === 'in-progress' ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  #{entry.ticketNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{entry.name}</span>
                    {entry.status === 'in-progress' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-semibold">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{entry.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{entry.waitTime} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <h4 className="font-semibold mb-1">For Emergencies</h4>
              <p>
                In case of medical emergencies, please go directly to the clinic. 
                Call campus security at ext. 911 for immediate assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <h4 className="font-semibold mb-1">Reduce Waiting Area Crowding</h4>
              <p>
                The digital queue system helps prevent overcrowding in the clinic waiting area, 
                promoting better social distancing and patient comfort.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold mb-4">Available Services</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'General Health Consultation',
            'Medical Certificates',
            'First Aid Treatment',
            'Health Screenings',
            'Vaccination Services',
            'Prescription Refills'
          ].map((service, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clinic;
