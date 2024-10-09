import 'bootstrap/dist/css/bootstrap.min.css';  // Voeg deze regel toe om Bootstrap-styles te importeren
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
  return (
    <Router>
      <Topbar /> {/* Voeg de TopBar bovenaan toe */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/create-post" element={<PostPage />} />
      </Routes>
      <Navbar /> {/* Voeg de bottom Navbar toe */}
    </Router>
  );
}

export default App;

