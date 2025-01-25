from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import openai
from ..models import db, TherapySession
from ..config import Config
import os

ai_therapy_bp = Blueprint('ai_therapy', __name__)

# Set OpenAI API key
openai.api_key = Config.OPENAI_API_KEY

@ai_therapy_bp.route('/api/ai-therapy-chat', methods=['POST'])
@login_required
def chat():
    data = request.get_json()
    message = data.get('message')
    test_results = data.get('testResults')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        # Create system message based on test results
        system_message = create_system_message(test_results)
        
        # Get chat response from OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ]
        )
        
        ai_response = response.choices[0].message.content

        # Save the therapy session
        session = TherapySession(
            user_id=current_user.id,
            user_message=message,
            ai_response=ai_response
        )
        db.session.add(session)
        db.session.commit()

        return jsonify({'response': ai_response})
    
    except Exception as e:
        print(f"Error in AI therapy chat: {str(e)}")
        return jsonify({
            'error': 'Failed to get AI response',
            'response': 'I apologize, but I am having trouble responding right now. Please try again.'
        }), 500

def create_system_message(test_results):
    base_message = """You are an empathetic AI therapy companion. Your role is to:
1. Provide emotional support and understanding
2. Offer practical coping strategies
3. Encourage professional help when needed
4. Maintain a warm and supportive tone
5. Ask thoughtful follow-up questions
6. Never provide medical diagnosis or replace professional medical advice

Remember to:
- Be patient and understanding
- Use active listening techniques
- Focus on the user's feelings and experiences
- Provide evidence-based coping strategies
- Maintain appropriate boundaries"""

    if not test_results:
        return base_message

    # Add context based on test results
    test_type = test_results.get('test_type')
    score = test_results.get('score', 0)
    percentage = (score / 60) * 100  # 60 is max score (20 questions * 3 max points)

    if test_type == 'adhd':
        if percentage >= 75:
            base_message += '''\n\nThe user has shown significant ADHD symptoms. Focus on:
- Organization and time management strategies
- Techniques for improving focus and concentration
- Ways to break tasks into manageable steps
- Strategies for managing impulsivity
- Building consistent routines'''
        elif percentage >= 50:
            base_message += '''\n\nThe user has shown moderate ADHD symptoms. Focus on:
- Simple organization techniques
- Focus improvement strategies
- Task management tips'''

    elif test_type == 'anxiety':
        if percentage >= 75:
            base_message += '''\n\nThe user has shown severe anxiety symptoms. Focus on:
- Immediate grounding techniques
- Breathing exercises
- Progressive muscle relaxation
- Identifying and challenging anxious thoughts
- Crisis management strategies'''
        elif percentage >= 50:
            base_message += '''\n\nThe user has shown moderate anxiety symptoms. Focus on:
- Basic relaxation techniques
- Stress management strategies
- Mindfulness practices'''

    elif test_type == 'depression':
        if percentage >= 75:
            base_message += '''\n\nThe user has shown severe depression symptoms. Focus on:
- Safety and crisis support
- Small, achievable daily goals
- Social connection and support
- Self-care basics
- The importance of professional help'''
        elif percentage >= 50:
            base_message += '''\n\nThe user has shown moderate depression symptoms. Focus on:
- Mood improvement strategies
- Daily structure and routine
- Behavioral activation
- Social support'''

    return base_message
