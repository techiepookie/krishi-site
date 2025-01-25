import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/api/insights');
        setInsights(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load insights');
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b">
        <Link to="/dashboard" className="text-gray-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold ml-4">Insights</h1>
      </div>

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Well-being Score</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="relative h-32 w-32">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-emerald-600"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - insights.overallScore / 100)}`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{insights.overallScore}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-600">Mental Health: {insights.mentalScore}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Physical Health: {insights.physicalScore}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Sleep Quality: {insights.sleepScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Trends</h2>
            <div className="space-y-4">
              {insights.trends?.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{trend.metric}</p>
                    <p className="text-sm text-gray-500">{trend.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    trend.direction === 'up' ? 'bg-green-100 text-green-800' :
                    trend.direction === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trend.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
            <div className="space-y-4">
              {insights.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    {rec.actionUrl && (
                      <Link
                        to={rec.actionUrl}
                        className="mt-2 inline-flex items-center text-sm text-emerald-600 hover:text-emerald-500"
                      >
                        Take action
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
