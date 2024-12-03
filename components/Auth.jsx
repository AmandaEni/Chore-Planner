import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

function Auth() {
  const [isSignup, setIsSignup] = useState(false); // Track signup/login mode
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  }); // Form data state
  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const navigate = useNavigate();

  /**
   * Handle input field changes
   * Updates the formData state and clears error messages
   */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // Clear error when user modifies input
  };

  /**
   * Toggle between Signup and Login mode
   */
  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    }); // Reset form data on mode switch
    setError(''); // Clear error state
  };

  /**
   * Validate the form data
   * Ensures required fields are filled and valid
   */
  const validateForm = () => {
    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are required.');
      return false;
    }
    if (isSignup && (!formData.first_name.trim() || !formData.last_name.trim())) {
      setError('First name and last name are required for registration.');
      return false;
    }
    return true;
  };

  /**
   * Format the form data for consistent database entries
   */
  const formatFormData = () => ({
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
  });

  /**
   * Handle form submission for Signup or Login
   * Makes API call based on the current mode
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
        setLoading(false);
        return;
    }

    const endpoint = isSignup
        ? 'http://localhost:8081/api/auth/signup'
        : 'http://localhost:8081/api/auth/login';

    try {
        const formattedData = formatFormData();
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid email or password.");
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred.");
        }

        const data = await response.json();

        if (isSignup) {
            alert("Account created successfully. Please log in.");
            toggleMode(); // Switch to Login mode
        } else {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.userId);
            alert("Login successful!");
            navigate('/'); // Redirect to home
        }
    } catch (err) {
        setError(err.message || "An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className={`auth-container ${isSignup ? 'signup-mode' : 'signin-mode'}`}>
      <header className="auth-header">
        <h1 className="auth-title">ACE</h1>
        <h2 className="auth-subtitle">Welcome To The Smart Chore Planner</h2>
        <p className="auth-description">Plan smart, live smart.</p>
      </header>

      <main className="auth-main">
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup ? (
            <>
              <h3>Create an Account</h3>
              <div className="auth-fields-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_nme}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p className="auth-switch">
                Already have an account?{' '}
                <span onClick={toggleMode} className="auth-link">
                  Sign In
                </span>
              </p>
            </>
          ) : (
            <>
              <h3>Sign In</h3>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="auth-switch">
                New to ACE?{' '}
                <span onClick={toggleMode} className="auth-link">
                  Create an Account
                </span>
              </p>
            </>
          )}
          {error && <p className="auth-error">{error}</p>}
        </form>
      </main>

      <footer className="auth-footer">
        <Link to="/contact">Contact</Link>
        <Link to="/community">Community</Link>
        <Link to="/help">Help</Link>
      </footer>
    </div>
  );
}

export default Auth;
