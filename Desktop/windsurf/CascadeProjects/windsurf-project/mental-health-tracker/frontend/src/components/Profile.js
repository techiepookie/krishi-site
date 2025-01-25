import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center">
              <UserCircleIcon className="w-20 h-20 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
              <p className="text-white/70">{user.email}</p>
              <p className="text-purple-400 mt-2">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold">Tests Completed</h3>
                <p className="text-2xl font-bold text-purple-400">{user.testsCompleted || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <ClockIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold">Minutes Meditated</h3>
                <p className="text-2xl font-bold text-purple-400">{user.meditationMinutes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-all">
            <div className="flex items-center space-x-4">
              <CogIcon className="w-6 h-6 text-purple-400" />
              <span>Settings</span>
            </div>
            <span className="text-white/50">→</span>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 backdrop-blur-lg rounded-xl p-4 flex items-center justify-between hover:bg-red-500/20 transition-all text-red-400"
          >
            <div className="flex items-center space-x-4">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span>Logout</span>
            </div>
            <span className="text-red-400/50">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
