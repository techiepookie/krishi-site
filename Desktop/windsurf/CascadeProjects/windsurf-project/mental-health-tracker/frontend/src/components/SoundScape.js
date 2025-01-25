import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function SoundScape() {
  const soundCategories = [
    {
      id: 1,
      title: 'Instrumental',
      songCount: '5 songs',
      image: '/images/instrumental.jpg',
      gradient: 'from-purple-900 to-pink-600'
    },
    {
      id: 2,
      title: 'Lofi',
      songCount: '6 songs',
      image: '/images/lofi.jpg',
      gradient: 'from-orange-500 to-yellow-400'
    },
    {
      id: 3,
      title: 'Lullaby',
      songCount: '5 songs',
      image: '/images/lullaby.jpg',
      gradient: 'from-green-800 to-green-500'
    },
    {
      id: 4,
      title: 'Meditation',
      songCount: '2 songs',
      image: '/images/meditation.jpg',
      gradient: 'from-blue-900 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="flex items-center p-4 bg-white">
        <Link to="/" className="text-gray-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold ml-4">Sound cape</h1>
      </div>

      {/* Sound Categories Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {soundCategories.map((category) => (
          <div key={category.id} className="relative overflow-hidden rounded-xl aspect-square">
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
            <img 
              src={category.image} 
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative p-4 flex flex-col justify-end h-full text-white">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <p className="text-sm opacity-90">{category.songCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SoundScape;
