import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

function ADHDTest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hearts, setHearts] = useState(5);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tests/adhd/questions`);
      if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        throw new Error('Invalid response format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
      setLoading(false);
    }
  };

  const handleAnswer = (optionId) => {
    if (!questions[currentStep]) return;
    
    setSelectedAnswer(optionId);
    setTimeout(() => {
      setAnswers({ ...answers, [questions[currentStep].id]: optionId });
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
      setSelectedAnswer(null);
    }, 1000);
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
        <Link to="/tests" className="text-emerald-500 hover:underline">
          Go Back
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <Link to="/tests" className="text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center space-x-2">
          {[...Array(hearts)].map((_, i) => (
            <span key={i} className="text-2xl">❤️</span>
          ))}
        </div>
        <div className="w-6"></div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="h-2 bg-gray-200">
          <div
            className="h-2 bg-emerald-500 transition-all duration-300"
            style={{ width: `${(currentStep / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {currentQuestion ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.text}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedAnswer === option.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Complete!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for completing the ADHD assessment. Your results are being processed.
              </p>
              <Link
                to="/tests"
                className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Back to Tests
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ADHDTest;
