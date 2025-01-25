import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tests/recent`);
      setTests(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError('Failed to load tests. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchTests}
          className="text-emerald-500 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mental Health Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Link 
            key={test.id}
            to={`/tests/${test.id}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="w-16 h-16 mb-4">
                <img 
                  src={test.image || '/images/default-test.png'} 
                  alt={test.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h2>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{test.duration}</span>
                <span>{test.questions} questions</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No tests available at the moment. Please check back later.
        </div>
      )}
    </div>
  );
}

export default Tests;
