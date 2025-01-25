const config = {
  apiUrl: 'http://localhost:3000/api',
  botpress: {
    webchatUrl: 'https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/24/16/20250124165818-FYVD2EU1.json',
    instructions: [
      "1. This is a safe space to discuss your mental health concerns.",
      "2. I am an AI assistant, not a replacement for professional medical help.",
      "3. In case of emergency or suicidal thoughts, please contact emergency services immediately.",
      "4. All conversations are confidential but not stored permanently.",
      "5. Be honest about your feelings - I'm here to listen and support."
    ],
    precautions: [
      "1. Do not share personally identifiable information.",
      "2. This is not a crisis hotline - seek immediate help if in crisis.",
      "3. The advice provided is general in nature.",
      "4. Regular check-ins with mental health professionals are recommended."
    ],
    cautions: [
      "1. Results and suggestions are AI-generated and may not be perfect.",
      "2. Always verify medical advice with qualified professionals.",
      "3. Take breaks if conversations become overwhelming."
    ]
  }
};

export default config;
