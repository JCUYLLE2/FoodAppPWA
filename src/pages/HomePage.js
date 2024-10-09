import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import logo from '../assets/logo.png';  // Importeer het logo, pas het pad aan naar jouw bestand

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center home-page">
      {/* Voeg het logo hier toe */}
      <img src={logo} alt="Food App Logo" className="home-logo" />

      <h1>Welcome to the Food App</h1>
      <p>Discover and share your favorite dishes!</p>
      <div className="mt-4">
        <Button variant="primary" onClick={() => navigate('/login')} className="me-3">
          Login
        </Button>
        <Button variant="success" onClick={() => navigate('/register')}>
          Register
        </Button>
      </div>
    </Container>
  );
}

export default HomePage;
