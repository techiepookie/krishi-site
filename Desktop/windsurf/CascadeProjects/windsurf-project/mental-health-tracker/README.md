# Mental Health Tracker

A comprehensive web application for mental health assessment and tracking, featuring ADHD, anxiety, and depression tests.

## Features

- Multiple mental health assessments (ADHD, Anxiety, Depression)
- User authentication and profile management
- Test history tracking
- Interactive UI with real-time feedback
- Secure API endpoints
- Mobile-responsive design

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mental-health-tracker.git
cd mental-health-tracker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login

### Tests
- GET `/api/tests/:type/questions` - Get test questions
- POST `/api/tests/:type/submit` - Submit test answers
- GET `/api/tests/recent` - Get user's recent tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
