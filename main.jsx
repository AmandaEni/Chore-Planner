import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Main application component
import { AuthProvider } from "./contexts/AuthContext.jsx"; // Authentication context for managing user state
import { ChoresProvider } from "./contexts/ChoresContext.jsx"; // Chores context for managing tasks
import "./index.css"; // Global styles

/**
 * The entry point for the application.
 * Wraps the app with necessary providers for global state and backend integration.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Authentication context provides login, logout, and session management */}
    <AuthProvider>
      {/* Chores context handles tasks-related state and actions */}
      <ChoresProvider>
        {/* Main app component containing routes and shared components */}
        <App />
      </ChoresProvider>
    </AuthProvider>
  </React.StrictMode>
);
