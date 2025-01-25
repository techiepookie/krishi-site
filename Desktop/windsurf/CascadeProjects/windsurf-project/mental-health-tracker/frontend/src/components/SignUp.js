import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: ''
  });
  const [assessment, setAssessment] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 2) {
      fetchAssessmentQuestions();
    }
  }, [step]);

  const fetchAssessmentQuestions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/auth/initial-assessment');
      setAssessment(response.data);
    } catch (err) {
      setError('Failed to load assessment questions');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAssessmentAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleMultipleChoice = (questionId, value) => {
    const currentAnswers = answers[questionId] || [];
    const updatedAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(v => v !== value)
      : [...currentAnswers, value];
    
    setAnswers({
      ...answers,
      [questionId]: updatedAnswers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/signup', {
        ...formData,
        initial_assessment: answers
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Create your account' : 'Quick Assessment'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-600 text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    required
                    value={formData.age}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {assessment.map((question) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{question.text}</h3>
                  
                  {question.type === 'scale' && (
                    <div className="flex justify-between space-x-2">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAssessmentAnswer(question.id, option.value)}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                            answers[question.id] === option.value
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'multiple' && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleMultipleChoice(question.id, option.value)}
                          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                            answers[question.id]?.includes(option.value)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'single' && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAssessmentAnswer(question.id, option.value)}
                          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                            answers[question.id] === option.value
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Complete Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
