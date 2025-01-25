import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    sleepQuality: '',
    stressLevel: '',
    socialSupport: '',
    physicalActivity: '',
    mentalHealthHistory: '',
    currentMedication: '',
    therapyExperience: '',
    copingMechanisms: '',
    substanceUse: '',
    workLifeBalance: '',
    dietaryHabits: '',
    relaxationPractices: '',
    goals: '',
    emergencyContact: '',
    preferredTherapyType: '',
    dailyMoodRating: '',
    anxietyTriggers: '',
    depressionSymptoms: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some(user => user.email === formData.email);
      
      if (userExists) {
        alert('An account with this email already exists. Please login instead.');
        navigate('/login');
        return;
      }

      // Save new user
      existingUsers.push(formData);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem('user', JSON.stringify(formData));
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact (Optional)</label>
        <input
          type="text"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          placeholder="Name and phone number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Type of Therapy</label>
        <select
          name="preferredTherapyType"
          value={formData.preferredTherapyType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select preference</option>
          <option value="cognitive">Cognitive Behavioral Therapy</option>
          <option value="mindfulness">Mindfulness-Based Therapy</option>
          <option value="psychodynamic">Psychodynamic Therapy</option>
          <option value="group">Group Therapy</option>
          <option value="art">Art Therapy</option>
          <option value="music">Music Therapy</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">How would you rate your sleep quality?</label>
        <select
          name="sleepQuality"
          value={formData.sleepQuality}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select an option</option>
          <option value="excellent">Excellent (7-9 hours regularly)</option>
          <option value="good">Good (6-7 hours regularly)</option>
          <option value="fair">Fair (5-6 hours or irregular)</option>
          <option value="poor">Poor (Less than 5 hours or very irregular)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Stress Level</label>
        <select
          name="stressLevel"
          value={formData.stressLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select an option</option>
          <option value="low">Low (Manageable daily stress)</option>
          <option value="moderate">Moderate (Frequent stress but coping)</option>
          <option value="high">High (Regular overwhelming stress)</option>
          <option value="severe">Severe (Constant, debilitating stress)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Mood Rating</label>
        <select
          name="dailyMoodRating"
          value={formData.dailyMoodRating}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select an option</option>
          <option value="5">5 - Very Good</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Neutral</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Very Poor</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Do you have any history of mental health conditions?</label>
        <select
          name="mentalHealthHistory"
          value={formData.mentalHealthHistory}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Common Anxiety Triggers (Select all that apply)</label>
        <textarea
          name="anxietyTriggers"
          value={formData.anxietyTriggers}
          onChange={handleChange}
          placeholder="E.g., public speaking, social situations, work deadlines..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          rows="3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Depression Symptoms (if any)</label>
        <textarea
          name="depressionSymptoms"
          value={formData.depressionSymptoms}
          onChange={handleChange}
          placeholder="E.g., changes in sleep, appetite, energy levels..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          rows="3"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What are your goals for using this platform?</label>
        <textarea
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          placeholder="What do you hope to achieve?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          rows="3"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Coping Mechanisms</label>
        <textarea
          name="copingMechanisms"
          value={formData.copingMechanisms}
          onChange={handleChange}
          placeholder="What strategies do you use to manage stress?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          rows="3"
        />
      </div>
      <div className="mt-6">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              required
              className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
            <p className="text-gray-500">
              By signing up, you agree to our Terms of Service and acknowledge our Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Step {step} of 5</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}

            <div className="flex justify-between space-x-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors ml-auto"
                >
                  Complete Signup
                </button>
              )}
            </div>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
