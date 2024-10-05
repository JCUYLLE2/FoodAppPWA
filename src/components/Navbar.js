import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/logout');  // Stuur de gebruiker naar de uitlogpagina
  };

  return (
    <nav>
      <h1>Food App</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li>
          <Button variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
