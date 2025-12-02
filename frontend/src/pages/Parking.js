import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car, Navigation, Clock, AlertCircle, ArrowLeft, CheckCircle, X } from 'lucide-react';

const Parking = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('all');
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0 });

  const defaultSpots = [
    { _id: '1', spotNumber: 'A1', zone: 'Zone A', status: 'occupied', type: 'car' },
    { _id: '2', spotNumber: 'A2', zone: 'Zone A', status: 'available', type: 'car' },
    { _id: '3', spotNumber: 'A3', zone: 'Zone A', status: 'available', type: 'car' },
    { _id: '4', spotNumber: 'A4', zone: 'Zone A', status: 'occupied', type: 'car' },
    { _id: '5', spotNumber: 'A5', zone: 'Zone A', status: 'available', type: 'car' },
    { _id: '6', spotNumber: 'B1', zone: 'Zone B', status: 'available', type: 'car' },
    { _id: '7', spotNumber: 'B2', zone: 'Zone B', status: 'occupied', type: 'car' },
    { _id: '8', spotNumber: 'B3', zone: 'Zone B', status: 'available', type: 'car' },
    { _id: '9', spotNumber: 'B4', zone: 'Zone B', status: 'available', type: 'car' },
    { _id: '10', spotNumber: 'B5', zone: 'Zone B', status: 'occupied', type: 'car' },
    { _id: '11', spotNumber: 'C1', zone: 'Zone C', status: 'occupied', type: 'car' },
    { _id: '12', spotNumber: 'C2', zone: 'Zone C', status: 'available', type: 'car' },
    { _id: '13', spotNumber: 'C3', zone: 'Zone C', status: 'available', type: 'car' },
    { _id: '14', spotNumber: 'C4', zone: 'Zone C', status: 'available', type: 'car' },
    { _id: '15', spotNumber: 'C5', zone: 'Zone C', status: 'available', type: 'car' },
  ];

  const loadParkingSpots = useCallback(async () => {
    try {
      setLoading(true);
      const [spotsRes, statsRes] = await Promise.all([
        axios.get('/api/parking'),
        axios.get('/api/parking/stats')
      ]);
      setParkingSpots(spotsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load parking spots:', err);
      setParkingSpots(defaultSpots);
      const available = defaultSpots.filter(s => s.status === 'available').length;
      const occupied = defaultSpots.filter(s => s.status === 'occupied').length;
      setStats({ total: defaultSpots.length, available, occupied, reserved: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParkingSpots();
    const interval = setInterval(loadParkingSpots, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadParkingSpots]);

  const handleOccupySpot = async (spot) => {
    if (spot.status !== 'available') return;
    setSelectedSpot(spot);
  };

  const confirmOccupy = async () => {
    try {
      await axios.post(`/api/parking/${selectedSpot._id}/occupy`);
      alert('Parking spot occupied successfully!');
      setSelectedSpot(null);
      loadParkingSpots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to occupy parking spot');
    }
  };

  const handleReleaseSpot = async (spotId) => {
    if (!window.confirm('Are you sure you want to release this parking spot?')) return;
    try {
      await axios.post(`/api/parking/${spotId}/release`);
      alert('Parking spot released successfully!');
      loadParkingSpots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to release parking spot');
    }
  };

  const filteredSpots = selectedZone === 'all'
    ? parkingSpots
    : parkingSpots.filter(spot => spot.zone === selectedZone);

  const availableCount = stats.available;
  const totalCount = stats.total;
  const occupancyRate = totalCount > 0 ? Math.round(((totalCount - availableCount) / totalCount) * 100) : 0;

  const zones = ['Zone A', 'Zone B', 'Zone C'];
  const zoneStats = zones.map(zone => {
    const zoneSpots = parkingSpots.filter(s => s.zone === zone);
    const available = zoneSpots.filter(s => s.status === 'available').length;
    return { zone, available, total: zoneSpots.length };
  });

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
            <h2 className="text-2xl mb-2 font-bold">Smart Parking System</h2>
            <p className="text-gray-600">Real-time parking availability powered by ultrasonic sensors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl text-green-600 mb-1 font-bold">{availableCount}</div>
            <div className="text-sm text-gray-600">Spots Available</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl text-blue-600 mb-1 font-bold">{totalCount}</div>
            <div className="text-sm text-gray-600">Total Spots</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="text-2xl text-orange-600 mb-1 font-bold">{occupancyRate}%</div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl text-purple-600 mb-1 font-bold">~2min</div>
            <div className="text-sm text-gray-600">Avg. Search Time</div>
          </div>
        </div>

        {/* Zone Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedZone === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Zones
          </button>
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedZone === zone
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Zone Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {zoneStats.map(stat => (
            <div key={stat.zone} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{stat.zone}</h4>
                <Navigation className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl text-green-600 font-bold">{stat.available}</div>
                  <div className="text-sm text-gray-600">available</div>
                </div>
                <div className="text-sm text-gray-500">of {stat.total}</div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(stat.available / stat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Parking Grid */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="mb-4 font-semibold text-lg">Parking Map</h3>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading parking spots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
              {filteredSpots.map(spot => (
                <button
                  key={spot._id}
                  onClick={() => handleOccupySpot(spot)}
                  disabled={spot.status !== 'available'}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                    spot.status === 'available'
                      ? 'bg-green-100 border-2 border-green-400 hover:bg-green-200 cursor-pointer hover:scale-105'
                      : spot.status === 'occupied'
                      ? 'bg-red-100 border-2 border-red-400 cursor-not-allowed'
                      : 'bg-yellow-100 border-2 border-yellow-400 cursor-not-allowed'
                  }`}
                  title={`${spot.zone} - ${spot.spotNumber} - ${spot.status}`}
                >
                  <Car className={`w-4 h-4 mb-1 ${
                    spot.status === 'available' ? 'text-green-600' : 
                    spot.status === 'occupied' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className={`${
                    spot.status === 'available' ? 'text-green-700 font-medium' : 
                    spot.status === 'occupied' ? 'text-red-700 font-medium' : 'text-yellow-700 font-medium'
                  }`}>
                    {spot.spotNumber}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {selectedSpot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Confirm Parking</h3>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{selectedSpot.spotNumber}</div>
                    <div className="text-sm text-gray-600">{selectedSpot.zone}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between mb-1">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{selectedSpot.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">Available</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important Notice:</p>
                    <p>Once occupied, this spot will be marked as yours. Make sure to release it when you leave.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmOccupy}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-900 mb-1 font-semibold">Smart Sensor Technology</h4>
                <p className="text-sm text-blue-800">
                  HC-SR04 Ultrasonic Sensors detect vehicle presence in real-time. 
                  Updates are pushed to the cloud instantly when a spot becomes available or occupied.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-900 mb-1 font-semibold">Reduced Search Time</h4>
                <p className="text-sm text-green-800">
                  Find parking 5x faster! Average search time reduced from 10+ minutes to under 2 minutes, 
                  saving fuel and reducing carbon emissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="mb-3 font-semibold">Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center">
                <Car className="w-4 h-4 text-green-600" />
              </div>
              <span>Available - Click to navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 border-2 border-red-400 rounded flex items-center justify-center">
                <Car className="w-4 h-4 text-red-600" />
              </div>
              <span>Occupied - Vehicle detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parking;
