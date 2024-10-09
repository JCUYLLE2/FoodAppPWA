import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
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
