import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DoorOpen, Car, Coffee, BookOpen, HeartPulse, Users, Leaf, TrendingUp, TrendingDown, CheckCircle, Clock, MapPin } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parkingStats, setParkingStats] = useState({ available: 0, total: 0 });
  const [roomStats, setRoomStats] = useState({ available: 0, total: 0 });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadUpcomingBookings();
  }, []);

  const loadStats = async () => {
    try {
      const [parkingRes, roomsRes] = await Promise.all([
        axios.get('/api/parking/stats'),
        axios.get('/api/rooms')
      ]);
      
      setParkingStats(parkingRes.data);
      
      const availableRooms = roomsRes.data.filter(r => r.status === 'available').length;
      setRoomStats({ available: availableRooms, total: roomsRes.data.length });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      const upcoming = res.data
        .filter(b => new Date(b.date) >= new Date() && b.status === 'confirmed')
        .slice(0, 2);
      setUpcomingBookings(upcoming);
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const quickStats = [
    { label: 'Spaces Available', value: roomStats.available, total: roomStats.total, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Parking Spots', value: parkingStats.available, total: parkingStats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Books Available', value: '2.4K', total: '5K', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'CO₂ Saved Today', value: user?.carbonSaved?.toFixed(0) + 'kg' || '0kg', icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const modules = [
    {
      id: 'booking',
      title: 'WinSpace',
      description: 'Book rooms and study spaces',
      icon: DoorOpen,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'parking',
      title: 'Smart Parking',
      description: 'Find available parking spots',
      icon: Car,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'canteen',
      title: 'Canteen',
      description: 'Check meal availability',
      icon: Coffee,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'library',
      title: 'Library',
      description: 'Browse books & reserve seats',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'clinic',
      title: 'Health Services',
      description: 'Digital queue system',
      icon: HeartPulse,
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'faculty',
      title: 'Faculty Consult',
      description: 'Book consultation slots',
      icon: Users,
      color: 'from-indigo-500 to-blue-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
            <p className="text-green-50 mb-6">Manage your campus life efficiently and sustainably</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/booking')}
                className="px-6 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Book a Space
              </button>
              <button
                onClick={() => navigate('/parking')}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                Find Parking
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-xl p-4`}>
              <div className={`${stat.color} mb-2`}>
                {stat.icon && <stat.icon className="w-5 h-5" />}
              </div>
              <div className="text-2xl mb-1 font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">
                {stat.label}
                {stat.total && <span className="text-gray-400"> / {stat.total}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="mb-4 font-semibold text-lg">Upcoming Bookings</h3>
            <div className="space-y-3">
              {upcomingBookings.map((booking, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        Room
                      </span>
                      <span className="font-medium">{booking.room?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div>
          <h3 className="mb-4 font-semibold text-lg">All Services</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => navigate('/' + module.id)}
                  className="group text-left bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className={`relative h-32 bg-gradient-to-br ${module.color} p-6`}>
                    <div className="absolute top-3 left-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 font-semibold">{module.title}</h4>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
