import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Award, Leaf, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-xs">
        <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 border border-white rounded-sm"></div>
          <div className="w-1 h-3 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-xl ring-4 ring-white/30">
            {user && getInitials(user.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
            <p className="opacity-90 text-lg">{user?.studentId}</p>
            <p className="text-sm opacity-75 mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
              <Award className="w-7 h-7" />
            </div>
            <p className="text-sm opacity-90 mb-1">Your GPA</p>
            <p className="text-3xl font-bold">{user?.gpa?.toFixed(2) || '0.00'}</p>
            <p className="text-xs opacity-75 mt-1">Academic Performance</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
              <Leaf className="w-7 h-7" />
            </div>
            <p className="text-sm opacity-90 mb-1">Carbon Saved</p>
            <p className="text-3xl font-bold">{user?.carbonSaved?.toFixed(1) || '0'}<span className="text-lg"> kg</span></p>
            <p className="text-xs opacity-75 mt-1">Environmental Impact</p>
          </div>
        </div>

        {/* Profile Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2\">
            <div className="w-2 h-8 bg-blue-600 rounded-full\"></div>
            Profile Information
          </h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-100">
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-bold text-gray-900 text-base">{user?.name}</p>
                </div>
              </div>

              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-bold text-gray-900 text-base">{user?.email}</p>
                </div>
              </div>

              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Student ID</p>
                  <p className="font-bold text-gray-900 text-base">{user?.studentId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
            Account Settings
          </h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-100">
              <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 text-left transition-colors">
                <span className="font-semibold text-gray-900 text-base">Edit Profile</span>
                <span className="text-gray-400 text-xl">›</span>
              </button>
              
              <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 text-left transition-colors">
                <span className="font-semibold text-gray-900 text-base">Preferences</span>
                <span className="text-gray-400 text-xl">›</span>
              </button>
              
              <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 text-left transition-colors">
                <span className="font-semibold text-gray-900 text-base">Privacy & Security</span>
                <span className="text-gray-400 text-xl">›</span>
              </button>
              
              <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 text-left transition-colors">
                <span className="font-semibold text-gray-900 text-base">Help & Support</span>
                <span className="text-gray-400 text-xl">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold hover:from-red-700 hover:to-red-800 flex items-center justify-center gap-2 shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
