import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Main App component
import { AuthProvider } from "./contexts/AuthContext.jsx"; // Authentication context provider
import { ChoresProvider } from "./contexts/ChoresContext.jsx"; // Chores context provider
import { BrowserRouter } from "react-router-dom"; // React Router for routing
import "./index.css"; // Global styles

/**
 * The entry point for the application.
 * Wrapping the app with necessary providers for authentication, chores, and routing.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Authentication context to manage user login/logout state */}
      <AuthProvider>
        {/* Chores context to manage chores state and actions */}
        <ChoresProvider>
          <App /> {/* Main application component */}
        </ChoresProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
