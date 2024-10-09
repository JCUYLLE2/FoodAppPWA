import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './Topbar.css'; // Zorg voor de juiste CSS

function TopBar() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log('Fetching user data for user:', user.uid);  // Log voor user ID
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.gebruikersnaam || user.email);
            setProfilePic(data.profilePic || '');  // Controleer of profilePic wordt opgehaald
            console.log('ProfilePic URL:', data.profilePic);  // Log de profielfoto URL
          } else {
            console.log('No user document found for user:', user.uid);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate('/')}>
        {/* Voeg hier je logo toe */}
        <img src="/path/to/logo.png" alt="Logo" className="logo-img" />
      </div>
      <div className="user-info">
        {/* Fallback naar default profielfoto als de URL leeg is */}
        {profilePic ? (
          <Image src={profilePic} roundedCircle className="profile-pic" />
        ) : (
          <Image src="/path/to/default-profile.png" roundedCircle className="profile-pic" />
        )}
        <span className="user-name">{userName}</span>
      </div>
    </div>
  );
}

export default TopBar;
