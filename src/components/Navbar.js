import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/logout');  // Stuur naar de logoutpagina na uitloggen
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-bottom">
      <div className="hamburger" onClick={toggleMenu}>
        &#9776; {/* Dit is het hamburger-icoon */}
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <Button
            variant="outline-primary"
            size="lg"
            className="navbar-button"
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
        </li>
        <li>
          <Button
            variant="outline-success"
            size="lg"
            className="navbar-button"
            onClick={() => navigate('/feed')}
          >
            Feed
          </Button>
        </li>
        <li>
          <Button
            variant="success"
            size="lg"
            className="navbar-button create-post-button"
            onClick={() => navigate('/create-post')}
          >
            + Create Post
          </Button>
        </li>
        <li>
          <Button
            variant="outline-danger"
            size="lg"
            className="navbar-button"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
