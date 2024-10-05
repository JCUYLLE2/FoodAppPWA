import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';  // Voeg een apart CSS-bestand toe voor styling

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/logout');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="navbar-bottom">
      <ul className="navbar-links">
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/feed">Feed</Link></li>
        <li>
          <Button 
            variant="success" 
            className="create-post-button" 
            onClick={() => navigate('/post')}
          >
            Create Post
          </Button>
        </li>
        <li>
          <Button variant="danger" onClick={handleLogout}>Log out</Button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
