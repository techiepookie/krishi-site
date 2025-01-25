import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/') ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/dashboard') ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <ChartBarIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>

        <Link
          to="/explore"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/explore') ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <SparklesIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>

        <Link
          to="/ai-therapy"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/ai-therapy') ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="text-xs mt-1">AI Therapy</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/profile') ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <UserCircleIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default BottomNav;
