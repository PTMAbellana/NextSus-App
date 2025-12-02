import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, DoorOpen, Car, Coffee, BookOpen, HeartPulse, Users, Leaf, Calendar, User, X, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/booking', label: 'WinSpace', icon: DoorOpen },
    { path: '/parking', label: 'Parking', icon: Car },
    { path: '/canteen', label: 'Canteen', icon: Coffee },
    { path: '/library', label: 'Library', icon: BookOpen },
    { path: '/clinic', label: 'Health Services', icon: HeartPulse },
    { path: '/faculty', label: 'Faculty Consult', icon: Users },
    { path: '/ecotrack', label: 'Eco-Track', icon: Leaf },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img 
              src="/nextsus-icon.png" 
              alt="NextSus Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg">NextSus</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
