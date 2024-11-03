import 'bootstrap/dist/css/bootstrap.min.css';  // Voeg deze regel toe om Bootstrap-styles te importeren
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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

function AppContent() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/feed');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Hier kun je een laadscherm of spinner tonen
  }

  return (
    <>
      <Topbar /> {/* Voeg de TopBar bovenaan toe */}
      <Routes>
        {/* Redirect voor ingelogde gebruikers */}
        <Route path="/" element={user ? <Navigate to="/feed" /> : <HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/feed" /> : <RegisterPage />} />
        
        {/* Beveiligde routes voor ingelogde gebruikers */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/feed" element={user ? <FeedPage /> : <Navigate to="/" />} />
        <Route path="/logout" element={user ? <LogoutPage /> : <Navigate to="/" />} />
        <Route path="/create-post" element={user ? <PostPage /> : <Navigate to="/" />} />
      </Routes>
      <Navbar /> {/* Voeg de bottom Navbar toe */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
