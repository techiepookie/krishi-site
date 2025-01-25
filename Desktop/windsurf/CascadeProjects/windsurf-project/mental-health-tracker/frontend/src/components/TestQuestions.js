import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { tests } from '../services/api';

function TestQuestions() {
  const { testType } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [testType]);

  const fetchQuestions = async () => {
    try {
      const response = await tests.getQuestions(testType);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

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
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await tests.submitTest(testType, answers);
      navigate(`/tests/${testType}/results`, { state: { result: response.data.result } });
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center mb-8">
            <Link to="/explore" className="text-white hover:text-purple-300">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Loading Assessment...</h1>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300 mx-auto"></div>
            <p className="mt-4">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center mb-8">
            <Link to="/explore" className="text-white hover:text-purple-300">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Error</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchQuestions}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center mb-8">
          <Link to="/explore" className="text-white hover:text-purple-300">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold ml-4">{testType.toUpperCase()} Assessment</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h2>
              <span className="text-sm text-white/70">Progress: {Math.round((currentQuestion / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-lg mb-6">{questions[currentQuestion]?.question}</p>
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    answers[currentQuestion] === index
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion]}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestQuestions;
