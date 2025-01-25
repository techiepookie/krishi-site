import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Emoji Characters */}
        <div className="relative w-full h-48 mb-8">
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2">
            <div className="bg-emerald-200 w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-xl">🌸</span>
            </div>
          </div>
          <div className="absolute top-1/4 right-1/4">
            <div className="bg-blue-200 w-16 h-16 rounded-lg flex items-center justify-center">
              <span className="text-2xl">☁️</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/3">
            <div className="bg-rose-200 w-14 h-14 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="absolute center-center">
            <div className="bg-teal-200 w-20 h-20 rounded-lg flex items-center justify-center">
              <span className="text-3xl">😊</span>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome~</h1>
        <p className="text-gray-600 mb-12 max-w-xs">
          Improve emotional health, and access mental wellness tools—all in one app.
        </p>

        {/* Get Started Button */}
        <Link
          to="/signup"
          className="w-full max-w-xs bg-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Get Started
        </Link>

        {/* Login Link */}
        <Link
          to="/login"
          className="mt-4 text-emerald-600 hover:text-emerald-700"
        >
          Already have an account? Log in
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-sm text-gray-500">
        This action may contain advertising
      </div>
    </div>
  );
}

export default Welcome;
