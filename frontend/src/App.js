import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import Grades from './pages/Grades';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/students"  element={<Students />} />
            <Route path="/subjects"  element={<Subjects />} />
            <Route path="/grades"    element={<Grades />} />
            <Route path="*"          element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
