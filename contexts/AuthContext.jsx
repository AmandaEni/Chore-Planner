import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [loading, setLoading] = useState(true); // Track loading state
  const backendUrl = "http://localhost:8081/api/auth"; // Base URL for backend API

  // Function to log in the user
  const login = async (credentials) => {
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Send email and password
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const { token, userId } = await response.json();

      // Fetch user details after successful login
      const userDetails = await fetchUserDetails(userId, token);

      setUser(userDetails);
      setIsAuthenticated(true);

      // Save token and userId to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      return { success: true, message: "Login successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear(); // Clear localStorage
  };

  // Function to sign up a new user
  const signup = async (userData) => {
    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send user data (e.g., email, password, firstName, lastName)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed.");
      }

      return { success: true, message: "Signup successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Function to fetch user details by userId
  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch(`${backendUrl}/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user details.");
      }

      return await response.json(); // Return user details
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      throw error;
    }
  };

  // Function to fetch the authenticated user's details
  const fetchAuthenticatedUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        const userDetails = await fetchUserDetails(userId, token);
        setUser(userDetails);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching authenticated user:", error.message);
      setIsAuthenticated(false);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
