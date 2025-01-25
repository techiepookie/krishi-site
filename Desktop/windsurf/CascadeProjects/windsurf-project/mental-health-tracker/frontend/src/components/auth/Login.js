import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      console.log('Form submitted:', formData);
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to continue your wellness journey</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-emerald-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Sign In
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.878v-6.987h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.343,21.128,22,16.991,22,12z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-500 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need immediate help?{' '}
              <a href="tel:988" className="text-emerald-500 hover:underline font-medium">
                Call 988
              </a>
              {' '}for 24/7 crisis support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
