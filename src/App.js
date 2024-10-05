import 'bootstrap/dist/css/bootstrap.min.css';  // Voeg deze regel toe om Bootstrap-styles te importeren
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LogoutPage from './pages/LogoutPage';  // Voeg deze regel toe

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<LogoutPage />} />  {/* Voeg deze regel toe */}
      </Routes>
    </Router>
  );
}

export default App;
