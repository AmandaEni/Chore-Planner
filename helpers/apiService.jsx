import axios from "axios";

// Base Axios Instance
const API = axios.create({
  baseURL: "http://localhost:8081/api/auth", // Backend base URL
  withCredentials: true, // Include cookies with requests
});

// Axios Interceptor: Automatically attach Authorization token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
  }
  return config;
}, (error) => Promise.reject(error));

// User API Services
const apiService = {
  /**
   * Register a new user.
   * @param {Object} user - { email, password, firstName, lastName }
   * @returns {Promise<Object>} Response data from the backend.
   */
  signup: async (user) => {
    return sendRequest(() =>
      API.post("/signup", {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    );
  },

  /**
   * Authenticate a user and store the token.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { message, userId } on success.
   */
  login: async (credentials) => {
    return sendRequest(async () => {
      const response = await API.post("/login", credentials);
      const { token, userId } = response.data;
      localStorage.setItem("authToken", token); // Save token for future requests
      return { message: "Login successful", userId };
    });
  },

  /**
   * Fetch details of a user by ID.
   * @param {String} userId - The user's ID.
   * @returns {Promise<Object>} User details from the backend.
   */
  getUserDetails: async (userId) => {
    return sendRequest(() => API.get(`/user/${userId}`));
  },
};

/**
 * Helper function to handle API requests.
 * Simplifies error handling and ensures a consistent response structure.
 * @param {Function} requestFn - The API call function.
 * @returns {Promise<Object>} API response or error.
 */
const sendRequest = async (requestFn) => {
  try {
    const response = await requestFn(); // Execute the API call
    return response.data; // Return the successful response data
  } catch (error) {
    handleApiError(error); // Handle API errors
  }
};

/**
 * Handle API Errors
 * Returns meaningful messages based on the error type.
 * @param {Object} error - Axios error object.
 */
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const defaultMessage = data.message || "An error occurred on the server.";
    // Handle common status codes
    switch (status) {
      case 400:
        throw new Error("Invalid input. Please check your data.");
      case 401:
        throw new Error("Unauthorized. Please log in again.");
      case 403:
        throw new Error("Access denied. You do not have permission.");
      case 404:
        throw new Error("Resource not found.");
      case 500:
        throw new Error("Internal server error. Try again later.");
      default:
        throw new Error(defaultMessage);
    }
  } else if (error.request) {
    throw new Error("No response received. Check your connection or backend.");
  } else {
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export default apiService;
