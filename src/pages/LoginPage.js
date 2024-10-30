import React, { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig'; // Verwijs naar je Firebase configuratie
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Gebruik de useSignInWithEmailAndPassword hook uit react-firebase-hooks
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password); // Probeer in te loggen met Firebase
  };

  // Gebruik useEffect voor navigatie om mogelijke render-loops te vermijden
  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5 login-container">
      <h2 className="text-center">Login</h2>
      {error && <Alert variant="danger">{error.message}</Alert>} {/* Toon foutmeldingen */}
      <Form onSubmit={handleLogin} className="login-form">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Emailadres</Form.Label>
          <Form.Control
            type="email"
            placeholder="Voer je email in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-3">
          <Form.Label>Wachtwoord</Form.Label>
          <Form.Control
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {loading ? (
          <Button variant="primary" disabled className="mt-4 w-100">
            Loading...
          </Button>
        ) : (
          <Button variant="primary" type="submit" className="mt-4 w-100">
            Log in
          </Button>
        )}
      </Form>
    </Container>
  );
}

export default LoginPage;
