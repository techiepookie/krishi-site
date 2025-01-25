import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function TestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/tests/history');
        setHistory(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load test history');
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTestIcon = (testType) => {
    switch (testType) {
      case 'adhd':
        return '🎯';
      case 'anxiety':
        return '😰';
      case 'depression':
        return '😔';
      default:
        return '📝';
    }
  };

  const getTestName = (testType) => {
    switch (testType) {
      case 'adhd':
        return 'ADHD Test';
      case 'anxiety':
        return 'Anxiety Test';
      case 'depression':
        return 'Depression Test';
      default:
        return 'Unknown Test';
    }
  };

  const getScoreColor = (score, testType) => {
    const percentage = (score / 60) * 100; // 60 is max score (20 questions * 3 max points)
    if (percentage >= 75) return 'text-red-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading history...</div>
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b">
        <Link to="/test" className="text-gray-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold ml-4">Test History</h1>
      </div>

      {/* History List */}
      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No test history available.</p>
            <Link to="/test" className="text-emerald-500 mt-4 inline-block">
              Take your first test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTestIcon(result.test_type)}</span>
                    <div>
                      <h3 className="font-semibold">{getTestName(result.test_type)}</h3>
                      <p className="text-sm text-gray-500">{formatDate(result.created_at)}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${getScoreColor(result.score, result.test_type)}`}>
                    {Math.round((result.score / 60) * 100)}%
                  </div>
                </div>
                <Link
                  to={`/test/${result.test_type}`}
                  className="text-emerald-500 text-sm hover:underline"
                >
                  Take test again →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestHistory;
