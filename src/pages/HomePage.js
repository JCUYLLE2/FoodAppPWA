import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Container } from 'react-bootstrap';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectAfterOpening = () => {
      auth.onAuthStateChanged(user => {
        if (user) {
          navigate('/feed');  // Stuur ingelogde gebruikers naar de feed
        } else {
          navigate('/login');  // Stuur niet-ingelogde gebruikers naar de loginpagina
        }
      });
    };

    // Redirection na 3 seconden
    setTimeout(redirectAfterOpening, 3000);
  }, [navigate]);

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to the Food App</h1>
      <p>Discover and share your favorite dishes!</p>
    </Container>
  );
}

export default HomePage;
