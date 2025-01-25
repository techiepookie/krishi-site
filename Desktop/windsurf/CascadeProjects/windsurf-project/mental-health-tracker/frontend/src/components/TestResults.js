import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

function TestResults() {
  const location = useLocation();
  const { results, testType } = location.state || {};

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
            <p className="mb-6">Please take a test to see your results.</p>
            <Link
              to="/tests"
              className="inline-flex items-center text-purple-400 hover:text-purple-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="text-center mb-8">
            <CheckCircleIcon className="h-16 w-16 mx-auto text-green-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
            <p className="text-white/80">
              Thank you for completing the {testType.replace('-', ' ')} assessment
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Results</h3>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span>Score</span>
                <span className="text-2xl font-bold">{results.score}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full mb-4">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(results.score / results.maxScore) * 100}%` }}
                ></div>
              </div>
              <p className="text-white/80">{results.feedback}</p>
            </div>
          </div>

          <div className="space-y-4">
            {results.recommendations && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-white/80">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/tests"
              className="inline-flex items-center text-purple-400 hover:text-purple-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Tests
            </Link>
            <Link
              to="/explore"
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestResults;
