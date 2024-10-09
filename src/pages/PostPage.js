import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function PostPage() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [recipeLink, setRecipeLink] = useState(''); // Nieuw veld voor receptlink
  const [photo, setPhoto] = useState(null); // Nieuw veld voor foto
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const storage = getStorage(); // Firebase Storage reference

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
      let photoURL = '';
      // Upload de afbeelding naar Firebase Storage als er een afbeelding is geselecteerd
      if (photo) {
        const storageRef = ref(storage, `dishPhotos/${user.uid}/${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(snapshot.ref); // Krijg de downloadbare URL van de afbeelding
      }

      // Voeg een nieuwe post toe aan Firestore
      await addDoc(collection(db, 'posts'), {
        dishName,
        description,
        recipeLink, // Sla de link naar het recept op
        photoURL, // Sla de URL van de geüploade afbeelding op
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

        {/* Veld voor het uploaden van een foto */}
        <Form.Group controlId="formPhoto" className="mt-3">
          <Form.Label>Upload Photo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </Form.Group>

        {/* Veld voor de link naar het recept */}
        <Form.Group controlId="formRecipeLink" className="mt-3">
          <Form.Label>Recipe Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter the link to the recipe"
            value={recipeLink}
            onChange={(e) => setRecipeLink(e.target.value)}
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
