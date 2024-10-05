import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';  // Bootstrap-knop
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home-page">
      <Navbar />
      <header className="home-header">
        <h1>Welcome to the Food App</h1>
        <p>Share your favorite dishes and get inspired by others!</p>
        <Button variant="primary" size="lg" onClick={handleGetStarted}>
          Let's Get Started
        </Button>
      </header>
    </div>
  );
}

export default HomePage;
