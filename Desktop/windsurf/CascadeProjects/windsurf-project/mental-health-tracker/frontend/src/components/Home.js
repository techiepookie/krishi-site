import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BeakerIcon, 
  BoltIcon, 
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  MusicalNoteIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function Home() {
  const features = [
    {
      icon: BeakerIcon,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your responses to provide personalized insights and recommendations.'
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'Virtual Therapy Sessions',
      description: 'Connect with our AI therapist for supportive conversations and guidance.'
    },
    {
      icon: HeartIcon,
      title: 'Mental Health Tracking',
      description: 'Track your mental well-being over time with comprehensive assessments and progress monitoring.'
    },
    {
      icon: MusicalNoteIcon,
      title: 'Music Therapy',
      description: 'Access curated playlists and meditation tracks designed to improve your mood and reduce stress.'
    },
    {
      icon: SparklesIcon,
      title: 'Daily Inspiration',
      description: 'Start each day with motivational quotes and mindfulness exercises to boost your mental wellness.'
    },
    {
      icon: BoltIcon,
      title: 'Instant Support',
      description: '24/7 access to mental health resources and coping strategies when you need them most.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white">
          <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Mind Mate
          </h1>
          <p className="text-2xl mb-12 max-w-2xl mx-auto">
            Your AI-powered mental wellness companion. Discover peace, clarity, and support through our innovative digital therapy platform.
          </p>
          
          <div className="flex gap-4">
            <Link
              to="/test"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Take Assessment
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-lg text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white/10 backdrop-blur-lg text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose Mind Mate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
                <feature.icon className="w-12 h-12 mb-4 text-pink-400" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Start Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/explore" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white hover:bg-white/20 transition-all">
                <h3 className="text-2xl font-semibold mb-4">Daily Wellness</h3>
                <p className="mb-4 opacity-75">Access daily inspiration, meditation videos, and breathing exercises to maintain your mental well-being.</p>
                <span className="text-pink-400 group-hover:text-pink-300">Explore Now →</span>
              </div>
            </Link>
            <Link to="/test" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white hover:bg-white/20 transition-all">
                <h3 className="text-2xl font-semibold mb-4">Mental Health Assessment</h3>
                <p className="mb-4 opacity-75">Take our comprehensive mental health tests and get personalized insights and recommendations.</p>
                <span className="text-pink-400 group-hover:text-pink-300">Take Assessment →</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Begin Your Mental Wellness Journey?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of users who have transformed their lives with Mind Mate.</p>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
