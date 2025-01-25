import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import ADHDTest from './components/ADHDTest';
import AnxietyTest from './components/AnxietyTest';
import DepressionTest from './components/DepressionTest';
import TestResults from './components/TestResults';
import Explore from './components/Explore';
import Dashboard from './components/Dashboard';
import AiTherapy from './components/AiTherapy';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tests/adhd" element={<ADHDTest />} />
            <Route path="/tests/anxiety" element={<AnxietyTest />} />
            <Route path="/tests/depression" element={<DepressionTest />} />
            <Route path="/test-results" element={<TestResults />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-therapy" element={<AiTherapy />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
