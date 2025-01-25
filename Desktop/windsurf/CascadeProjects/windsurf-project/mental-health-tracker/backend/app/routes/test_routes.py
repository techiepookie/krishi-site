from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..database import db

test_bp = Blueprint('test', __name__)
CORS(test_bp)

TEST_QUESTIONS = {
    'adhd': [
        {
            'id': 1,
            'text': 'Do you often have trouble getting organized?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ],
    'anxiety': [
        {
            'id': 1,
            'text': 'Do you often feel nervous, anxious, or on edge?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ],
    'depression': [
        {
            'id': 1,
            'text': 'Do you feel down, depressed, or hopeless?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ],
    'stress': [
        {
            'id': 1,
            'text': 'How often do you feel overwhelmed by daily tasks?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ],
    'sleep': [
        {
            'id': 1,
            'text': 'How often do you have trouble falling asleep?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ],
    'burnout': [
        {
            'id': 1,
            'text': 'How often do you feel emotionally drained from your work?',
            'options': [
                {'id': 0, 'text': 'Not at all', 'points': 0},
                {'id': 1, 'text': 'Several days', 'points': 1},
                {'id': 2, 'text': 'More than half the days', 'points': 2},
                {'id': 3, 'text': 'Nearly every day', 'points': 3}
            ]
        },
        # Add more questions...
    ]
}

@test_bp.route('/tests/questions/<test_type>', methods=['GET'])
def get_test_questions(test_type):
    if test_type not in TEST_QUESTIONS:
        return jsonify({'error': 'Test type not found'}), 404
    return jsonify(TEST_QUESTIONS[test_type])

@test_bp.route('/tests/submit/<test_type>', methods=['POST'])
@jwt_required()
def submit_test(test_type):
    try:
        data = request.get_json()
        answers = data.get('answers', {})
        total_questions = data.get('totalQuestions', 0)
        
        if not answers or not total_questions:
            return jsonify({'error': 'Invalid submission data'}), 400

        # Calculate score
        score = sum(answers.values())
        max_score = total_questions * 3  # Each question has max value of 3
        score_percentage = (score / max_score) * 100

        # Get feedback based on score
        feedback = get_feedback(test_type, score_percentage)
        
        # Update user's profile
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            setattr(user, f'{test_type}_score', score_percentage)
            db.session.commit()

        return jsonify({
            'score': score,
            'maxScore': max_score,
            'feedback': feedback['message'],
            'recommendations': feedback['recommendations']
        })

    except Exception as e:
        print(f"Error in submit_test: {str(e)}")
        return jsonify({'error': 'Failed to submit test'}), 500

@test_bp.route('/tests', methods=['GET'])
def get_available_tests():
    tests = [
        {
            'id': 'adhd',
            'title': 'ADHD Assessment',
            'description': 'Evaluate attention, focus, and hyperactivity symptoms.',
            'duration': '5-10 min',
            'questions': 20
        },
        {
            'id': 'anxiety',
            'title': 'Anxiety Assessment',
            'description': 'Measure your anxiety levels and get personalized recommendations.',
            'duration': '5-10 min',
            'questions': 20
        },
        {
            'id': 'depression',
            'title': 'Depression Screening',
            'description': 'Assess your mood and emotional well-being.',
            'duration': '5-10 min',
            'questions': 20
        },
        {
            'id': 'stress',
            'title': 'Stress Assessment',
            'description': 'Understand your stress levels and learn coping strategies.',
            'duration': '5-10 min',
            'questions': 20
        },
        {
            'id': 'sleep',
            'title': 'Sleep Quality Test',
            'description': 'Evaluate your sleep patterns and get tips for better sleep.',
            'duration': '5-10 min',
            'questions': 20
        },
        {
            'id': 'burnout',
            'title': 'Burnout Assessment',
            'description': 'Check your burnout risk and learn work-life balance strategies.',
            'duration': '5-10 min',
            'questions': 20
        }
    ]
    return jsonify(tests)

def get_feedback(test_type, score):
    feedback_map = {
        'adhd': {
            'high': {
                'message': 'Your responses indicate significant ADHD symptoms.',
                'recommendations': [
                    'Consider consulting a mental health professional',
                    'Implement structured daily routines',
                    'Use organization tools and reminders',
                    'Practice mindfulness techniques'
                ]
            },
            'medium': {
                'message': 'Your responses suggest moderate ADHD symptoms.',
                'recommendations': [
                    'Try time management techniques',
                    'Break tasks into smaller chunks',
                    'Create to-do lists',
                    'Consider professional support'
                ]
            },
            'low': {
                'message': 'Your responses indicate mild or no ADHD symptoms.',
                'recommendations': [
                    'Maintain regular exercise',
                    'Practice focusing exercises',
                    'Keep a consistent schedule'
                ]
            }
        },
        # Add similar feedback for other test types
    }
    
    if score >= 70:
        severity = 'high'
    elif score >= 40:
        severity = 'medium'
    else:
        severity = 'low'
        
    return feedback_map.get(test_type, {}).get(severity, {
        'message': 'Thank you for completing the assessment.',
        'recommendations': ['Consider discussing your results with a mental health professional']
    })

@test_bp.route('/tests/status', methods=['GET'])
def test_route():
    return jsonify({"status": "ok"})

@test_bp.route('/tests/recent', methods=['GET'])
def get_recent_tests():
    tests = [
        {
            'id': 'anxiety',
            'title': 'Anxiety Assessment',
            'description': 'Measure your anxiety levels and get personalized recommendations.',
            'duration': '5-10 min',
            'questions': 20,
            'image': '/images/anxiety-test.png'
        },
        {
            'id': 'depression',
            'title': 'Depression Screening',
            'description': 'Assess your mood and emotional well-being.',
            'duration': '5-10 min',
            'questions': 20,
            'image': '/images/depression-test.png'
        },
        {
            'id': 'adhd',
            'title': 'ADHD Assessment',
            'description': 'Evaluate attention, focus, and hyperactivity symptoms.',
            'duration': '5-10 min',
            'questions': 20,
            'image': '/images/adhd-test.png'
        }
    ]
    return jsonify(tests)
