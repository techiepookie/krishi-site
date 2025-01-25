import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function Test() {
  const tests = [
    {
      id: 'adhd',
      title: 'ADHD Test',
      description: 'Do you have ADHD?',
      questions: 20,
      duration: '10 Minutes',
      color: 'bg-blue-100'
    },
    {
      id: 'anxiety',
      title: 'Anxiety Test',
      description: 'Check your anxiety levels',
      questions: 15,
      duration: '8 Minutes',
      color: 'bg-green-100'
    },
    {
      id: 'depression',
      title: 'Depression Screening',
      description: 'Assess your mental well-being',
      questions: 18,
      duration: '12 Minutes',
      color: 'bg-purple-100'
    },
    {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'Measure your stress levels',
      questions: 15,
      duration: '8 Minutes',
      color: 'bg-yellow-100'
    },
    {
      id: 'sleep',
      title: 'Sleep Quality Test',
      description: 'Evaluate your sleep patterns',
      questions: 12,
      duration: '6 Minutes',
      color: 'bg-indigo-100'
    },
    {
      id: 'burnout',
      title: 'Burnout Assessment',
      description: 'Check your burnout risk',
      questions: 15,
      duration: '8 Minutes',
      color: 'bg-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center p-4 bg-white/10 backdrop-blur-lg">
        <Link to="/" className="text-white hover:text-gray-200">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold ml-4">Mental Health Tests</h1>
      </div>

      {/* Tests List */}
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Link key={test.id} to={`/tests/${test.id}`} className="block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
              <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
              <p className="text-white/80 mb-4">{test.description}</p>
              <div className="flex space-x-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {test.duration}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {test.questions} Questions
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Test;
