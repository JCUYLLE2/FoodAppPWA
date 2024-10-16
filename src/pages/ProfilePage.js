import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Gebruikt een Font Awesome icon voor de standaard profielfoto
import Navbar from '../components/Navbar'; // Importeer je Navbar component

function ProfilePage() {
  const [gebruikersnaam, setGebruikersnaam] = useState('');
  const [woonplaats, setWoonplaats] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(''); // Voorbeeld voor de gekozen afbeelding
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setGebruikersnaam(data.gebruikersnaam || '');
            setWoonplaats(data.woonplaats || '');
            setLeeftijd(data.leeftijd || '');
            setProfilePic(data.profilePic || '');
          } else {
            setError('No user data found.');
          }
        } catch (error) {
          setError('Failed to fetch user data.');
        }
      } else {
        setError('No user is logged in.');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;

      if (!user) {
        setError('You must be logged in to update your profile.');
        return;
      }

      let profilePicURL = profilePic;

      // Upload de nieuwe profielfoto naar Firebase Storage indien een nieuwe is gekozen
      if (profilePicFile) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePicFile);
        profilePicURL = await getDownloadURL(storageRef);
      }

      // Update de gebruikersinformatie in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        gebruikersnaam: gebruikersnaam,
        woonplaats: woonplaats,
        leeftijd: leeftijd,
        profilePic: profilePicURL,
        updatedAt: new Date(),
      });

      setSuccess('Profile updated successfully!');
      setProfilePic(profilePicURL);
      setProfilePicPreview(''); // Wis de preview na succesvol updaten
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // Sla het geselecteerde bestand op

      // Gebruik FileReader om een voorbeeld van de afbeelding te genereren
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result); // Sla de preview-URL op
      };
      reader.readAsDataURL(file); // Lees het bestand als Data URL
    }
  };

  return (
    <>
      <Navbar /> {/* Voeg de Navbar toe aan de pagina */}
      <Container className="mt-5 profile-container">
        <h2>Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleUpdate}>
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
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FaUserCircle size={150} />
              )}
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Update Profile
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default ProfilePage;
