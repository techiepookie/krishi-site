import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block">Your Mental Health</span>
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Matters Most
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Begin your journey to better mental well-being with personalized assessments,
              AI-powered therapy sessions, and comprehensive insights. We're here to support you every step of the way.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105"
                >
                  Start Your Journey
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105"
                >
                  Welcome Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comprehensive Mental Health Support
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to understand and improve your mental well-being
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div>
                <div className="h-14 w-14 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">Comprehensive Assessment</h3>
                <p className="mt-4 text-gray-600 text-center">
                  Take detailed mental health assessments covering anxiety, depression, ADHD, and stress levels. Get personalized insights and recommendations.
                </p>
                <div className="mt-6 text-center">
                  <Link to="/tests" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Take Assessment →
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div>
                <div className="h-14 w-14 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">AI Therapy Support</h3>
                <p className="mt-4 text-gray-600 text-center">
                  Access 24/7 AI-powered therapy sessions for immediate support, guidance, and coping strategies tailored to your needs.
                </p>
                <div className="mt-6 text-center">
                  <Link to="/ai-therapy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Start Session →
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div>
                <div className="h-14 w-14 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">Progress & Insights</h3>
                <p className="mt-4 text-gray-600 text-center">
                  Track your mental health journey with detailed analytics, progress reports, and personalized recommendations.
                </p>
                <div className="mt-6 text-center">
                  <Link to="/insights" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    View Insights →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                title: "Student",
                quote: "This platform helped me understand and manage my anxiety during exam periods. The AI therapy sessions are incredibly helpful!"
              },
              {
                name: "Michael Chen",
                title: "Professional",
                quote: "The comprehensive assessments gave me insights into my stress levels and helped me make positive changes in my work-life balance."
              },
              {
                name: "Emily Rodriguez",
                title: "Teacher",
                quote: "I love how accessible and user-friendly the platform is. The progress tracking keeps me motivated on my mental health journey."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Join thousands of others who have taken the first step towards better mental health.
          </p>
          <div className="mt-8">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
