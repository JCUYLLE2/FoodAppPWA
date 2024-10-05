import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function PostPage() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Controleer of de gebruiker is ingelogd
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    try {
      // Voeg een nieuwe post toe aan Firestore
      await addDoc(collection(db, 'posts'), {
        dishName,
        description,
        userEmail: user.email,  // Sla het e-mailadres van de gebruiker op
        createdAt: new Date(),
      });
      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate('/feed');  // Na succesvolle post terug naar de feed
      }, 2000);
    } catch (error) {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create a New Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDishName">
          <Form.Label>Dish Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the name of your dish"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe your dish"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Create Post
        </Button>
      </Form>
    </Container>
  );
}

export default PostPage;
