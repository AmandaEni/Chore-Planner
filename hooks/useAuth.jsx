import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing user authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null); // Holds the current authenticated user's data
  const [loading, setLoading] = useState(false); // Tracks if an operation is ongoing
  const [error, setError] = useState(null); // Stores error messages for display

  const API_BASE_URL = "http://localhost:8081/api/auth"; // Base URL for authentication API

  /**
   * Fetch the current authenticated user
   * This runs once on component initialization or mount
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // If no token is found, assume the user is logged out
        if (!token || typeof token !== "string") {
          setUser(null);
          return;
        }

        // Fetch user data from the backend using fetch API
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData); // Update user state with fetched data
      } catch (err) {
        console.error("Error fetching user data:", err);

        // Clear the token if the fetch fails (e.g., invalid token or expired session)
        localStorage.removeItem("authToken");
        setUser(null);
        setError("Failed to fetch user data. Please log in again.");
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchUser();
  }, []);

  /**
   * Logs the user in
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null); // Clear any existing error state

      // Send login request to the backend using fetch API
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, ...userData } = await response.json();

      // Save the authentication token in local storage
      localStorage.setItem("authToken", token);

      // Update the user state with the returned user data
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);

      // Provide an error message for UI display
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registers a new user
   * @param {Object} data - User registration data
   * @param {string} data.email - Email address
   * @param {string} data.password - Password
   * @param {string} data.first_name - First name
   * @param {string} data.last_name - Last name
   */
  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous error state

      // Send registration request to the backend using fetch API
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const { token, ...userData } = await response.json();

      // Save the token and update user state
      localStorage.setItem("authToken", token);
      setUser(userData);
    } catch (err) {
      console.error("Registration failed:", err);

      // Provide an error message for UI display
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logs the user out
   * Clears authentication state and local storage
   */
  const logout = useCallback(() => {
    try {
      // Remove the token from local storage
      localStorage.removeItem("authToken");

      // Clear user data and errors
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  /**
   * Updates the user profile
   * @param {Object} updates - Updated user profile data
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Send a request to update the user profile using fetch API
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update the user state with the new profile data
    } catch (err) {
      console.error("Profile update failed:", err);

      // Provide an error message for UI display
      setError(err.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user, // Current user state
    loading, // Loading state for UI feedback
    error, // Error message for UI display
    login, // Function to log in the user
    register, // Function to register a new user
    logout, // Function to log out the user
    updateProfile, // Function to update user profile
  };
};
