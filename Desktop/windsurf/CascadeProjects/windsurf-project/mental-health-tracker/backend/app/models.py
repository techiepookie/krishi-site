from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    initial_assessment = db.Column(db.JSON, nullable=True, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    test_results = db.relationship('TestResult', backref='user', lazy=True, cascade='all, delete-orphan')
    health_data = db.relationship('HealthData', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'gender': self.gender,
            'initial_assessment': self.initial_assessment or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class TestResult(db.Model):
    __tablename__ = 'test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    test_type = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Float, nullable=False)
    responses = db.Column(db.JSON, nullable=False, default=dict)
    recommendations = db.Column(db.Text, nullable=True)
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'test_type': self.test_type,
            'score': self.score,
            'responses': self.responses or {},
            'recommendations': self.recommendations,
            'taken_at': self.taken_at.isoformat() if self.taken_at else None
        }

class HealthData(db.Model):
    __tablename__ = 'health_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    steps = db.Column(db.Integer, default=0)
    sleep_hours = db.Column(db.Float, default=0.0)
    heart_rate = db.Column(db.Integer, default=0)
    activity_score = db.Column(db.Float, default=0.0)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    source = db.Column(db.String(50), default='manual')

    def to_dict(self):
        return {
            'id': self.id,
            'steps': self.steps,
            'sleep_hours': self.sleep_hours,
            'heart_rate': self.heart_rate,
            'activity_score': self.activity_score,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None,
            'source': self.source
        }
