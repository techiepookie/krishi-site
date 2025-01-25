from datetime import datetime
from database import db

class GoogleFitData(db.Model):
    __tablename__ = 'google_fit_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    access_token = db.Column(db.String(500), nullable=False)
    refresh_token = db.Column(db.String(500), nullable=False)
    token_expiry = db.Column(db.DateTime, nullable=False)
    last_sync = db.Column(db.DateTime, nullable=True)
    
    # Store the latest fitness data
    steps = db.Column(db.Integer, default=0)
    heart_rate = db.Column(db.Float, default=0)
    sleep_hours = db.Column(db.Float, default=0)
    active_minutes = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'last_sync': self.last_sync.isoformat() if self.last_sync else None,
            'fitness_data': {
                'steps': self.steps,
                'heart_rate': self.heart_rate,
                'sleep_hours': self.sleep_hours,
                'active_minutes': self.active_minutes
            }
        }
