import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Voeg een Font Awesome icon toe

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gebruikersnaam, setGebruikersnaam] = useState('');
  const [woonplaats, setWoonplaats] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Bestand voor profielfoto
  const [profilePicPreview, setProfilePicPreview] = useState(null); // State voor preview
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const storage = getStorage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Maak een nieuwe gebruiker aan met Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let profilePicURL = '';

      // Upload profielfoto naar Firebase Storage als deze bestaat
      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        profilePicURL = await getDownloadURL(storageRef);
      } else {
        profilePicURL = ''; // Leeg laten als er geen profielfoto is
      }

      // Sla extra gebruikersinformatie op in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        gebruikersnaam: gebruikersnaam,
        woonplaats: woonplaats,
        leeftijd: leeftijd,
        profilePic: profilePicURL, // Gebruik de geüploade profielfoto of leeg
        createdAt: new Date(),
      });

      setSuccess('User registered successfully!');
      navigate('/feed');  // Na het registreren doorsturen naar de FeedPage
    } catch (error) {
      setError('Failed to register. Please try again.');
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file); // Sla de gekozen afbeelding op

      // Gebruik FileReader om een voorbeeld van de afbeelding te genereren
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result); // Sla de preview-URL op in de state
      };
      reader.readAsDataURL(file); // Lees het bestand als Data URL
    }
  };

  return (
    <Container className="mt-5 register-container">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formGebruikersnaam">
          <Form.Label>Gebruikersnaam</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={gebruikersnaam}
            onChange={(e) => setGebruikersnaam(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formWoonplaats" className="mt-3">
          <Form.Label>Woonplaats</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your city"
            value={woonplaats}
            onChange={(e) => setWoonplaats(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLeeftijd" className="mt-3">
          <Form.Label>Leeftijd</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter your age"
            value={leeftijd}
            onChange={(e) => setLeeftijd(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formProfilePic" className="mt-3">
  <Form.Label>Profielfoto</Form.Label>
  <div>
    {!profilePicPreview && <FaUserCircle size={100} />} {/* Gebruik het standaard icoon */}
    {profilePicPreview && (
      <img
        src={profilePicPreview}
        alt="Profile Preview"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          objectFit: 'cover', // Zorgt ervoor dat de afbeelding niet vervormt
        }}
      />
    )}
    <Form.Control
      type="file"
      accept="image/*"
      onChange={handleProfilePicChange}
    />
  </div>
</Form.Group>


        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterPage;
