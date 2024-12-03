import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import `useLocation` for active link tracking

const Navbar = () => {
  const [user, setUser] = useState(null); // State to store user details
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate();
  const location = useLocation(); // Get current path for active link styling
  const backendUrl = "http://localhost:8081/api/auth"; // Backend base URL

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId"); // Assuming userId is stored after login

      if (token && userId) {
        const response = await fetch(`${backendUrl}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const userDetails = await response.json();
        setUser(userDetails);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setIsAuthenticated(false);
      localStorage.clear(); // Clear stored data if token is invalid
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    setUser(null); // Reset user state
    setIsAuthenticated(false); // Update authentication state
    navigate("/login"); // Redirect to login page
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">Smart Chore Planner</Link>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li className={`navbar-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/">Home</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/chores" ? "active" : ""}`}>
          <Link to="/chores">Chores</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/calendar" ? "active" : ""}`}>
          <Link to="/calendar">Calendar</Link>
        </li>
      </ul>

      {/* User Authentication Links */}
      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.firstName || "User"}!</span>
            <Link to="/tasks" className="navbar-link">My Tasks</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
