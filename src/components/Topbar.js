import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';
import './Topbar.css';
import logo from '../assets/logo.png';

function TopBar() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [user, loading] = useAuthState(auth);
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

  const handleLogoClick = () => {
    if (user) {
      navigate('/feed'); // Als ingelogd, ga naar de feed
    } else {
      navigate('/'); // Anders, ga naar de homepage
    }
  };

  if (loading) {
    return null; // Laadindicator indien nodig
  }

  return (
    <div className="top-bar">
      <div className="logo" onClick={handleLogoClick}>
        <img src={logo} alt="App Logo" className="logo-img" />
      </div>
      {user && (
        <div className="user-info">
          {profilePic ? (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="profile-pic" 
              style={{ width: 50, height: 50, borderRadius: '50%' }}
            />
          ) : (
            <FaUserCircle size={50} className="profile-icon" />
          )}
          <span className="user-name">{userName}</span>
        </div>
      )}
    </div>
  );
}

export default TopBar;
