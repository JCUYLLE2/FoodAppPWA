import 'bootstrap/dist/css/bootstrap.min.css';  // Voeg deze regel toe om Bootstrap-styles te importeren
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig'; // Importeer de Firebase-authenticatieconfiguratie
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import LogoutPage from './pages/LogoutPage';
import PostPage from './pages/PostPage';
import Topbar from './components/Topbar'; // Import the TopBar component
import Navbar from './components/Navbar'; // Import the bottom Navbar

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Hier kun je een laadscherm of spinner tonen
  }

  return (
    <Router>
      <Topbar /> {/* Voeg de TopBar bovenaan toe */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Beveiligde routes */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/feed" element={user ? <FeedPage /> : <Navigate to="/" />} />
        <Route path="/logout" element={user ? <LogoutPage /> : <Navigate to="/" />} />
        <Route path="/create-post" element={user ? <PostPage /> : <Navigate to="/" />} />
      </Routes>
      <Navbar /> {/* Voeg de bottom Navbar toe */}
    </Router>
  );
}

export default App;
