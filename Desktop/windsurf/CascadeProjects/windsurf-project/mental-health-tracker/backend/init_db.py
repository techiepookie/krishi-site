from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash

def init_database():
    # Create the Flask app
    app = create_app()
    
    # Push an application context
    with app.app_context():
        print('Creating database tables...')
        db.create_all()
        
        print('Checking for test user...')
        test_user = User.query.filter_by(email='test@example.com').first()
        if not test_user:
            test_user = User(
                name='Test User',
                email='test@example.com',
                password=generate_password_hash('password123'),
                age=25,
                gender='other',
                initial_assessment={
                    '1': 'Good',
                    '2': 'Sometimes',
                    '3': 'Well'
                }
            )
            db.session.add(test_user)
            db.session.commit()
            print('Test user created successfully!')
            print('Email: test@example.com')
            print('Password: password123')
        else:
            print('Test user already exists')

if __name__ == '__main__':
    print('Initializing database...')
    try:
        init_database()
        print('Database initialized successfully!')
    except Exception as e:
        print(f'Error initializing database: {str(e)}')
