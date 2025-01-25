import React, { useState } from 'react';

function MusicTherapy() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const musicPlaylists = [
    { 
      id: 1, 
      title: 'Calm & Relaxing', 
      description: 'Soothing melodies to reduce stress and anxiety',
      tracks: ['Ocean Waves', 'Gentle Piano', 'Forest Sounds']
    },
    { 
      id: 2, 
      title: 'Motivational Boost', 
      description: 'Upbeat tracks to elevate mood and energy',
      tracks: ['Inspiring Instrumental', 'Power Anthem', 'Positive Vibes']
    },
    { 
      id: 3, 
      title: 'Meditation Sounds', 
      description: 'Ambient music for mindfulness and meditation',
      tracks: ['Zen Garden', 'Tibetan Bowls', 'Peaceful Strings']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Music Therapy</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicPlaylists.map(playlist => (
          <div 
            key={playlist.id} 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition duration-300"
            onClick={() => setSelectedPlaylist(playlist)}
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-3">{playlist.title}</h2>
            <p className="text-gray-600">{playlist.description}</p>
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">{selectedPlaylist.title}</h2>
            <p className="mb-4">{selectedPlaylist.description}</p>
            <ul className="list-disc pl-5">
              {selectedPlaylist.tracks.map((track, index) => (
                <li key={index} className="mb-2">{track}</li>
              ))}
            </ul>
            <button 
              onClick={() => setSelectedPlaylist(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicTherapy;
