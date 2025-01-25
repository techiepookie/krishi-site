import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Mind Mate</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/') 
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              to="/explore"
              className={`${
                isActive('/explore')
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
            >
              Explore
            </Link>
            <Link
              to="/ai-therapy"
              className={`${
                isActive('/ai-therapy')
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
            >
              AI Therapy
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className={`${
                  isActive('/profile')
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                } transition-colors`}
              >
                Profile
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className={`${
                    isActive('/login')
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:text-purple-600'
                  } px-4 py-2 rounded-lg transition-colors`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
