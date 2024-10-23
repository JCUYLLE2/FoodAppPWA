import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  if (user) {
    navigate('/feed');  // Navigeer naar de FeedPage na succesvol inloggen
  }

  return (
    <Container className="mt-5 login-container">
      <h2 className="text-center">Login</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}
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
