import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  HeartIcon,
  MoonIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    mood: 75,
    sleep: 85,
    stress: 45,
    activity: 65
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const renderProgressBar = (value) => {
    return (
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-white/70">Here's your mental wellness overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mood */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <HeartIcon className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">Mood</h3>
              </div>
              <span className="text-lg font-bold text-purple-400">{stats.mood}%</span>
            </div>
            {renderProgressBar(stats.mood)}
          </div>

          {/* Sleep */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MoonIcon className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">Sleep Quality</h3>
              </div>
              <span className="text-lg font-bold text-purple-400">{stats.sleep}%</span>
            </div>
            {renderProgressBar(stats.sleep)}
          </div>

          {/* Stress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BoltIcon className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">Stress Level</h3>
              </div>
              <span className="text-lg font-bold text-purple-400">{stats.stress}%</span>
            </div>
            {renderProgressBar(stats.stress)}
          </div>

          {/* Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">Activity Level</h3>
              </div>
              <span className="text-lg font-bold text-purple-400">{stats.activity}%</span>
            </div>
            {renderProgressBar(stats.activity)}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-5 h-5 text-purple-400" />
                <span>Completed Anxiety Test</span>
              </div>
              <span className="text-sm text-white/70">2 days ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <HeartIcon className="w-5 h-5 text-purple-400" />
                <span>Meditation Session</span>
              </div>
              <span className="text-sm text-white/70">3 days ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <MoonIcon className="w-5 h-5 text-purple-400" />
                <span>Sleep Analysis</span>
              </div>
              <span className="text-sm text-white/70">5 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
