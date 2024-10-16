import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Favorites from './components/Favorites';
import Match from './components/Match';
import Chat from './components/Chat';
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = (id) => {
    setIsAuthenticated(true);
    setUserId(id);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/favorites" /> : <Login login={login} />} />
        <Route path="/favorites" element={isAuthenticated ? <Favorites userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/match" element={isAuthenticated ? <Match userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <Chat userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
