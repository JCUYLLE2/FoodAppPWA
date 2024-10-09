import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Gebruikt een Font Awesome icon voor de standaard profielfoto

function ProfilePage() {
  const [gebruikersnaam, setGebruikersnaam] = useState('');
  const [woonplaats, setWoonplaats] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [profilePic, setProfilePic] = useState(''); // Profielfoto URL
  const [profilePicFile, setProfilePicFile] = useState(null); // Bestand voor profielfoto upload
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        console.log('User is logged in:', user); // Debugging log
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
  const data = userDoc.data();
  console.log('User data fetched:', data); // Voeg dit toe voor extra debugging
  setGebruikersnaam(data.gebruikersnaam || '');
  setWoonplaats(data.woonplaats || '');
  setLeeftijd(data.leeftijd || '');
  setProfilePic(data.profilePic || '');
} else {
  console.log('No user data found in Firestore for UID:', user.uid); // Voeg dit toe voor debugging
  setError('No user data found.');
}

        } catch (error) {
          console.error('Error fetching user data:', error); // Debugging log
          setError('Failed to fetch user data.');
        }
      } else {
        setError('No user is logged in.');
        console.log('No user is logged in'); // Debugging log
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
        profilePic: profilePicURL, // Update met nieuwe of bestaande profielfoto
        updatedAt: new Date(),
      });

      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error); // Debugging log
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
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
              <img
                src={profilePic}
                alt="Profile"
                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
              />
            ) : (
              <FaUserCircle size={150} /> // Gebruik een standaard Font Awesome user icon
            )}
          </div>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicFile(e.target.files[0])} // Profielfoto bestand uploaden
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Update Profile
        </Button>
      </Form>
    </Container>
  );
}

export default ProfilePage;
