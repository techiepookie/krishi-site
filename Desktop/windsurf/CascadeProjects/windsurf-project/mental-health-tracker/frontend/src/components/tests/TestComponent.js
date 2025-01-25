import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function TestComponent() {
  const { testType } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = {
    adhd: [
      { id: 1, text: "Do you often have trouble getting organized?" },
      { id: 2, text: "Do you frequently make careless mistakes?" },
      { id: 3, text: "Do you often have difficulty maintaining attention?" },
      { id: 4, text: "Do you often avoid tasks requiring sustained mental effort?" },
      { id: 5, text: "Do you frequently lose things necessary for tasks?" },
      { id: 6, text: "Are you easily distracted by external stimuli?" },
      { id: 7, text: "Do you often fidget or squirm when seated?" },
      { id: 8, text: "Do you have difficulty waiting your turn?" },
      { id: 9, text: "Do you often interrupt or intrude on others?" },
      { id: 10, text: "Do you often feel restless or 'on the go'?" }
    ],
    anxiety: [
      { id: 1, text: "Do you often feel nervous, anxious, or on edge?" },
      { id: 2, text: "Are you unable to stop or control worrying?" },
      { id: 3, text: "Do you worry too much about different things?" },
      { id: 4, text: "Do you have trouble relaxing?" },
      { id: 5, text: "Are you so restless that it's hard to sit still?" },
      { id: 6, text: "Do you become easily annoyed or irritable?" },
      { id: 7, text: "Do you feel afraid as if something awful might happen?" },
      { id: 8, text: "Do you experience physical symptoms of anxiety (heart racing, sweating)?" },
      { id: 9, text: "Do you avoid certain situations due to anxiety?" },
      { id: 10, text: "Does your anxiety interfere with daily activities?" }
    ],
    depression: [
      { id: 1, text: "Do you feel down, depressed, or hopeless?" },
      { id: 2, text: "Do you have little interest or pleasure in activities?" },
      { id: 3, text: "Do you have trouble falling asleep or sleeping too much?" },
      { id: 4, text: "Do you feel tired or have little energy?" },
      { id: 5, text: "Do you have poor appetite or overeat?" },
      { id: 6, text: "Do you feel bad about yourself or that you're a failure?" },
      { id: 7, text: "Do you have trouble concentrating?" },
      { id: 8, text: "Do you move or speak slowly, or feel restless?" },
      { id: 9, text: "Do you have thoughts of self-harm?" },
      { id: 10, text: "Do you feel isolated or lonely?" }
    ]
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[testType][currentQuestion].id]: value
    }));
    
    if (currentQuestion < questions[testType].length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 500);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const totalQuestions = questions[testType].length;
    const answeredQuestions = Object.keys(answers).length;
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxPossibleScore = totalQuestions * 3;
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

    return {
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage,
      answeredQuestions,
      totalQuestions,
      severity: percentage >= 75 ? 'High' : percentage >= 50 ? 'Moderate' : 'Low'
    };
  };

  const getRecommendations = (severity) => {
    const recommendations = {
      adhd: {
        High: [
          "Consider consulting a mental health professional specializing in ADHD",
          "Implement structured daily routines",
          "Use organization tools and reminders",
          "Practice mindfulness techniques"
        ],
        Moderate: [
          "Try time management techniques",
          "Break tasks into smaller chunks",
          "Create to-do lists",
          "Consider professional support"
        ],
        Low: [
          "Maintain regular exercise",
          "Practice focusing exercises",
          "Minimize distractions",
          "Keep a consistent schedule"
        ]
      },
      anxiety: {
        High: [
          "Seek professional help for anxiety management",
          "Practice deep breathing exercises",
          "Consider anxiety management techniques",
          "Maintain a support network"
        ],
        Moderate: [
          "Try meditation and mindfulness",
          "Exercise regularly",
          "Keep a worry journal",
          "Practice relaxation techniques"
        ],
        Low: [
          "Maintain healthy sleep habits",
          "Practice stress management",
          "Stay physically active",
          "Connect with others"
        ]
      },
      depression: {
        High: [
          "Seek immediate professional help",
          "Build a support network",
          "Maintain daily routines",
          "Consider therapy options"
        ],
        Moderate: [
          "Practice self-care regularly",
          "Stay connected with others",
          "Exercise regularly",
          "Set small, achievable goals"
        ],
        Low: [
          "Maintain healthy sleep patterns",
          "Stay active and engaged",
          "Practice gratitude",
          "Keep a mood journal"
        ]
      }
    };

    return recommendations[testType][severity] || [];
  };

  if (showResults) {
    const results = calculateScore();
    const recommendations = getRecommendations(results.severity);

    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Your Results</h2>
            
            {/* Score Display */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600">{results.percentage}%</div>
                    <div className="text-gray-500">Score</div>
                  </div>
                </div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full">
                  {results.severity} Risk
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start bg-emerald-50 p-4 rounded-lg">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                to="/tests"
                className="flex-1 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg text-center hover:bg-emerald-200 transition-colors"
              >
                Take Another Test
              </Link>
              <Link
                to="/explore"
                className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg text-center hover:bg-emerald-600 transition-colors"
              >
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 capitalize">{testType} Assessment</h2>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {questions[testType].length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions[testType].length) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions[testType].length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              {questions[testType][currentQuestion].text}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 0, label: 'Not at all' },
                { value: 1, label: 'Several days' },
                { value: 2, label: 'More than half the days' },
                { value: 3, label: 'Nearly every day' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-4 rounded-lg text-center transition-all transform hover:scale-105 ${
                    answers[questions[testType][currentQuestion].id] === option.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white border-2 border-emerald-200 text-gray-700 hover:border-emerald-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {questions[testType].map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentQuestion
                      ? 'bg-emerald-500'
                      : index < currentQuestion
                      ? 'bg-emerald-200'
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(questions[testType].length - 1, prev + 1))}
              disabled={currentQuestion === questions[testType].length - 1}
              className="px-4 py-2 text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestComponent;
