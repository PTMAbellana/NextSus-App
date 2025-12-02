import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/BottomNav';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Canteen from './pages/Canteen';
import Library from './pages/Library';
import Parking from './pages/Parking';
import Clinic from './pages/Clinic';
import Faculty from './pages/Faculty';
import EcoTrack from './pages/EcoTrack';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">NextSus</span>
        </div>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><AppLayout><Home /></AppLayout></PrivateRoute>} />
          <Route path="/booking" element={<PrivateRoute><AppLayout><Booking /></AppLayout></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><AppLayout><Schedule /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="/canteen" element={<PrivateRoute><AppLayout><Canteen /></AppLayout></PrivateRoute>} />
          <Route path="/library" element={<PrivateRoute><AppLayout><Library /></AppLayout></PrivateRoute>} />
          <Route path="/parking" element={<PrivateRoute><AppLayout><Parking /></AppLayout></PrivateRoute>} />
          <Route path="/clinic" element={<PrivateRoute><AppLayout><Clinic /></AppLayout></PrivateRoute>} />
          <Route path="/faculty" element={<PrivateRoute><AppLayout><Faculty /></AppLayout></PrivateRoute>} />
          <Route path="/ecotrack" element={<PrivateRoute><AppLayout><EcoTrack /></AppLayout></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
