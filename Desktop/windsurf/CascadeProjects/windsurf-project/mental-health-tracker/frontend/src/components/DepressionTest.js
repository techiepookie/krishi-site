import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

function DepressionTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/api/tests/depression/questions');
        console.log('Questions response:', response.data);
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit test
      try {
        const response = await api.post('/api/tests/depression/submit', {
          answers: newAnswers
        });
        setTestResults(response.data);
        setShowResults(true);
      } catch (err) {
        console.error('Error submitting test:', err);
        setError('Failed to submit test. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="text-red-600">{error}</div>
        <Link to="/test" className="text-emerald-500 mt-4 inline-block">
          Go Back
        </Link>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="flex items-center justify-between p-4">
          <Link to="/test" className="text-gray-800">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Test Results</h1>
          <div className="w-6" />
        </div>

        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{testResults.category}</h2>
              <div className="text-5xl font-bold text-emerald-500 mb-4">
                {testResults.percentage}%
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">
                Based on your responses, here's what we recommend:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Consider discussing these results with a mental health professional</li>
                <li>Practice relaxation techniques and mindfulness</li>
                <li>Try our AI Therapy feature for coping strategies</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link
                to="/ai-therapy"
                className="flex-1 bg-emerald-500 text-white rounded-full py-3 text-center"
              >
                Start AI Therapy
              </Link>
              <Link
                to="/test"
                className="flex-1 border border-gray-200 rounded-full py-3 text-center"
              >
                Take Another Test
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center justify-between p-4">
        <Link to="/test" className="text-gray-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold">Depression Test</h1>
        <div className="w-6" />
      </div>

      <div className="p-4">
        <div className="mb-8">
          <p className="text-xl mb-6">{questions[currentQuestion].text}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-emerald-500 focus:outline-none focus:border-emerald-500"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-600">
          Question: {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}

export default DepressionTest;
