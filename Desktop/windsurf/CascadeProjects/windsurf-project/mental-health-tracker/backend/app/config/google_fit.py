import os

GOOGLE_FIT_CONFIG = {
    'client_id': os.getenv('GOOGLE_FIT_CLIENT_ID'),
    'client_secret': os.getenv('GOOGLE_FIT_CLIENT_SECRET'),
    'redirect_uri': 'http://localhost:3000/google-fit-callback',
    'scopes': [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read',
        'https://www.googleapis.com/auth/fitness.body.read'
    ]
}
