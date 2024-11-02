import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Default profile icon
import Navbar from '../components/Navbar'; // Import your Navbar component

function ProfilePage() {
  const [gebruikersnaam, setGebruikersnaam] = useState('');
  const [woonplaats, setWoonplaats] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Only JPG, PNG, and GIF are allowed.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // Limit to 2 MB
        setError("File size should be less than 2 MB.");
        return;
      }
      setProfilePicFile(file);
      setError(""); // Clear any previous errors
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

      // Upload new profile picture to Firebase Storage if a new file is selected
      if (profilePicFile) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePicFile);
        profilePicURL = await getDownloadURL(storageRef);
      }

      // Update user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        gebruikersnaam: gebruikersnaam,
        woonplaats: woonplaats,
        leeftijd: leeftijd,
        profilePic: profilePicURL,
        updatedAt: new Date(),
      });

      setSuccess('Profile updated successfully!');
      setProfilePic(profilePicURL);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar to the page */}
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
                <img src={profilePic} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />
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

          <Button variant="primary" type="submit" className="mt-4" style={{ marginBottom: "3em" }}>
            Update Profile
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default ProfilePage;
