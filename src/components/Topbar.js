import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth'; // Gebruik de react-firebase-hooks
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './Topbar.css'; // Zorg voor de juiste CSS
import logo from '../assets/logo.png'; // Importeer het logo

function TopBar() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [user, loading] = useAuthState(auth); // Verwijder de ongebruikte 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.gebruikersnaam || user.email);
            setProfilePic(data.profilePic || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return null; // Je kunt hier een spinner of laadscherm tonen als je wilt
  }

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="App Logo" className="logo-img" />
      </div>
      {user && ( // Toon gebruikersinformatie alleen als de gebruiker is ingelogd
        <div className="user-info">
          {profilePic ? (
            <Image src={profilePic} roundedCircle className="profile-pic" />
          ) : (
            <Image src="/path/to/default-profile.png" roundedCircle className="profile-pic" />
          )}
          <span className="user-name">{userName}</span>
        </div>
      )}
    </div>
  );
}

export default TopBar;
