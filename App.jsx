import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './hooks/useAuth'; // Custom hook for authentication
import Navbar from './components/Navbar'; // Navbar component
import Home from './components/Home'; // Home page component
import Calendar from './components/Calendar'; // Calendar page component
import Chore from './components/Chore'; // Chore page component
import Auth from './components/Auth'; // Authentication page component
import { AuthProvider } from './contexts/AuthContext'; // Auth context provider
import './App.css'; // Global styles for the application

// Protected Route Component
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Check if the user is authenticated

  // Redirect to login if not authenticated
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Wrap the application in the AuthProvider for shared authentication state */}
      <AuthProvider>
        <div className="app">
          {/* Persistent Navbar */}
          <Navbar />

          {/* Main content area */}
          <div className="content">
            <Routes>
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute element={Home} />} />
              <Route path="/calendar" element={<ProtectedRoute element={Calendar} />} />
              <Route path="/chores" element={<ProtectedRoute element={Chore} />} />

              {/* Public route for login/signup */}
              <Route path="/login" element={<Auth />} />

              {/* Catch-all route for unknown paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
