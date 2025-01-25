import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AiTherapy() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Create an iframe for the Botpress chat
    const iframe = document.createElement('iframe');
    iframe.src = "https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/24/16/20250124165818-FYVD2EU1.json";
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    
    // Find the chat container and append the iframe
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.innerHTML = '';
      chatContainer.appendChild(iframe);
    }

    return () => {
      // Cleanup when component unmounts
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Therapy Session</h1>
          <p className="text-xl text-white/80">Your safe space to talk</p>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ul className="space-y-2 text-white/80">
              <li>1. This is a safe space to discuss your feelings</li>
              <li>2. Be honest and open about your concerns</li>
              <li>3. Take your time to express yourself</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Precautions</h2>
            <ul className="space-y-2 text-white/80">
              <li>1. Don't share personal information</li>
              <li>2. This is not a crisis service</li>
              <li>3. Seek professional help if needed</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Important</h2>
            <ul className="space-y-2 text-white/80">
              <li>1. AI responses are for guidance only</li>
              <li>2. Not a substitute for medical advice</li>
              <li>3. Emergency? Call local helpline</li>
            </ul>
          </div>
        </div>

        {/* Chat Container */}
        <div 
          id="chat-container"
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 min-h-[600px] w-full"
        ></div>
      </div>
    </div>
  );
}

export default AiTherapy;
