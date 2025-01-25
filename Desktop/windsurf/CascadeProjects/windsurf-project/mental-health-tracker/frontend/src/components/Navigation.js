import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChatBubbleBottomCenterTextIcon, UserIcon } from '@heroicons/react/24/outline';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-emerald-500' : 'text-gray-500'}`}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link to="/ai-therapy" className={`flex flex-col items-center ${isActive('/ai-therapy') ? 'text-emerald-500' : 'text-gray-500'}`}>
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          <span className="text-xs mt-1">AI Therapy</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-emerald-500' : 'text-gray-500'}`}>
          <UserIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
