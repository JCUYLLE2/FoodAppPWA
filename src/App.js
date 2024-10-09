import 'bootstrap/dist/css/bootstrap.min.css';  // Voeg deze regel toe om Bootstrap-styles te importeren
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Zorg ervoor dat je deze hebt
import RegisterPage from './pages/RegisterPage'; // Nieuwe registerpagina
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import LogoutPage from './pages/LogoutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
