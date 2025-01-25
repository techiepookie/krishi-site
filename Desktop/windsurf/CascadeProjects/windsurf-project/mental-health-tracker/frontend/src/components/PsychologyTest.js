import React, { useState } from 'react';
import axios from 'axios';

function PsychologyTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const mentalHealthQuestions = [
    {
      id: 1,
      question: "How often do you feel down or hopeless?",
      options: [
        { text: "Almost never", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Almost always", value: 4 }
      ]
    },
    {
      id: 2,
      question: "How would you rate your stress levels recently?",
      options: [
        { text: "Very low", value: 1 },
        { text: "Moderate", value: 2 },
        { text: "High", value: 3 },
        { text: "Extremely high", value: 4 }
      ]
    },
    // Add more questions
  ];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [mentalHealthQuestions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < mentalHealthQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (testAnswers) => {
    try {
      const response = await axios.post('/api/take-test', {
        test_type: 'mental_health_screening',
        responses: testAnswers
      });
      setTestResult(response.data.result);
    } catch (error) {
      console.error('Test submission error:', error);
    }
  };

  if (testResult) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Test Results</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4">Your Mental Health Score: {testResult.mental_health_score.toFixed(2)}</h2>
          <h3 className="text-xl mb-4">Recommendations:</h3>
          <ul className="list-disc list-inside">
            {testResult.recommendations.map((rec, index) => (
              <li key={index} className="mb-2">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Mental Health Screening</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl mb-6">{mentalHealthQuestions[currentQuestion].question}</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {mentalHealthQuestions[currentQuestion].options.map((option, index) => (
            <button 
              key={index}
              onClick={() => handleAnswer(option.value)}
              className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="mt-6 text-gray-600">
          Question {currentQuestion + 1} of {mentalHealthQuestions.length}
        </div>
      </div>
    </div>
  );
}

export default PsychologyTest;
