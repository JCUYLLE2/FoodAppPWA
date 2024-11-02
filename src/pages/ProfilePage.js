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
  const [profilePic, setProfilePic] = useState(''); // URL voor de huidige profielfoto
  const [profilePicFile, setProfilePicFile] = useState(null); // Bestand voor de nieuwe profielfoto
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

  // Functie om geselecteerde afbeelding te verwerken
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // Bewaar het bestand voor upload
      setProfilePic(URL.createObjectURL(file)); // Toon de afbeelding direct
    }
  };

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
      setProfilePic(profilePicURL); // Werk de profielfoto-URL bij
      setProfilePicFile(null); // Reset het profielbestand na upload
    } catch (error) {
      setError('Failed to update profile. Please try again.');
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
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: "2em"  }} />
              ) : (
                <FaUserCircle size={100} />
              )}
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleProfilePicChange}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" style={{ marginBottom: "5em" }}>
            Update Profile
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default ProfilePage;
