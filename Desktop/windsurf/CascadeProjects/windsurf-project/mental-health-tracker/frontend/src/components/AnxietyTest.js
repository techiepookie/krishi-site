import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

function AnxietyTest() {
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
        const response = await api.get('/tests/anxiety/questions');
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/tests/anxiety/submit', {
        answers,
        totalQuestions: questions.length
      });
      setTestResults(response.data);
      setShowResults(true);
    } catch (err) {
      setError('Failed to submit test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link to="/explore" className="text-white hover:text-purple-300">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Anxiety Assessment</h1>
          </div>
          <div className="text-center py-8">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link to="/explore" className="text-white hover:text-purple-300">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Anxiety Assessment</h1>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link to="/explore" className="text-white hover:text-purple-300">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Test Results</h1>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Your Anxiety Assessment Results</h2>
            <p className="mb-4">{testResults.summary}</p>
            <div className="mb-6">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${testResults.score}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-white/70">Score: {testResults.score}%</p>
            </div>
            <p className="mb-4">{testResults.recommendation}</p>
            <div className="flex justify-end mt-6">
              <Link
                to="/explore"
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Back to Tests
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center mb-6">
          <Link to="/explore" className="text-white hover:text-purple-300">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold ml-4">Anxiety Assessment</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
          <div className="mb-6">
            <p className="text-lg mb-4">{questions[currentQuestion]?.question}</p>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    answers[currentQuestion] === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {value === 0 && 'Never'}
                  {value === 1 && 'Sometimes'}
                  {value === 2 && 'Often'}
                  {value === 3 && 'Very Often'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? 'bg-white/5 text-white/50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className={`px-4 py-2 rounded-lg ${
                  Object.keys(answers).length !== questions.length
                    ? 'bg-white/5 text-white/50 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!(currentQuestion in answers)}
                className={`px-4 py-2 rounded-lg ${
                  !(currentQuestion in answers)
                    ? 'bg-white/5 text-white/50 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion
                    ? 'bg-purple-500'
                    : index in answers
                    ? 'bg-white/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnxietyTest;
