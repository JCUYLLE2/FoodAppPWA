import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function PostPage() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [recipeLink, setRecipeLink] = useState('');
  const [isOwnRecipe, setIsOwnRecipe] = useState(false); // Nieuw veld voor eigen recept
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const storage = getStorage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    try {
      let photoURL = '';
      if (photo) {
        const storageRef = ref(storage, `dishPhotos/${user.uid}/${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userName = user.email;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName = userData.gebruikersnaam || user.email;
      }

      await addDoc(collection(db, 'posts'), {
        dishName,
        description,
        recipeLink: isOwnRecipe ? '' : recipeLink, // Alleen opslaan als het geen eigen recept is
        isOwnRecipe, // Opslaan of het een eigen recept is
        photoURL,
        userName,
        userEmail: user.email,
        createdAt: new Date(),
      });

      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } catch (error) {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create a New Post</h2>

      {/* Alert Container */}
      <div style={{ marginBottom: "1em" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
      </div>

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

        <Form.Group controlId="formPhoto" className="mt-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group controlId="formIsOwnRecipe" className="mt-3">
          <Form.Check
            type="checkbox"
            label="This is my own recipe"
            checked={isOwnRecipe}
            onChange={(e) => setIsOwnRecipe(e.target.checked)}
          />
        </Form.Group>

        {!isOwnRecipe && (
          <Form.Group controlId="formRecipeLink" className="mt-3">
            <Form.Label>Recipe Link</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter the link to the recipe"
              value={recipeLink}
              onChange={(e) => setRecipeLink(e.target.value)}
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="mt-4">
          Create Post
        </Button>
      </Form>
    </Container>
  );
}

export default PostPage;
