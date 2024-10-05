import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

function LogoutPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        setMessage('You have been logged out successfully.');
        // Na enkele seconden terugsturen naar de loginpagina
        setTimeout(() => {
          navigate('/login');
        }, 3000);  // 3 seconden wachttijd
      } catch (error) {
        setMessage('Failed to log out. Please try again.');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <Container className="mt-5 text-center">
      <h2>Logout</h2>
      <p>{message}</p>
      <Button variant="primary" onClick={() => navigate('/login')}>
        Go to Login Page
      </Button>
    </Container>
  );
}

export default LogoutPage;
