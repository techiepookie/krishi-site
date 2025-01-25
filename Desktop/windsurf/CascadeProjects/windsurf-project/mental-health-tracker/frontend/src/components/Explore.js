import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon,
  BoltIcon,
  BeakerIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

function Explore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Mind Mate</h1>
          <p className="text-xl text-white/80">Discover resources to support your mental well-being</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <Link to="/dashboard" className="block">
              <BoltIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Personal Dashboard</h3>
              <p className="text-white/70">Track your mental health journey</p>
            </Link>
          </div>

          {/* AI Therapy Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <Link to="/ai-therapy" className="block">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">AI Therapy</h3>
              <p className="text-white/70">24/7 AI-powered support for your mental health needs</p>
            </Link>
          </div>

          {/* ADHD Test Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <Link to="/tests/adhd" className="block">
              <AcademicCapIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">ADHD Assessment</h3>
              <p className="text-white/70">Take a comprehensive ADHD screening test</p>
            </Link>
          </div>

          {/* Anxiety Test Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <Link to="/tests/anxiety" className="block">
              <BeakerIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Anxiety Assessment</h3>
              <p className="text-white/70">Evaluate your anxiety levels</p>
            </Link>
          </div>

          {/* Depression Test Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <Link to="/tests/depression" className="block">
              <HeartIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Depression Screening</h3>
              <p className="text-white/70">Assess your mood and emotional well-being</p>
            </Link>
          </div>

          {/* Resources Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <div className="block">
              <BookOpenIcon className="h-12 w-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Mental Health Resources</h3>
              <p className="text-white/70">Access helpful articles and guides</p>
              <div className="mt-4 space-y-2">
                <a href="#" className="block text-purple-400 hover:text-purple-300">Understanding Anxiety →</a>
                <a href="#" className="block text-purple-400 hover:text-purple-300">Depression Management →</a>
                <a href="#" className="block text-purple-400 hover:text-purple-300">ADHD Support →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
