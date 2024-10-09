import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';  // Voeg CSS voor verdere aanpassingen toe

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/logout');  // Stuur naar de logoutpagina na uitloggen
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="navbar-bottom">
      <ul className="navbar-links">
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
