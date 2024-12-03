import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ChoresContext
const ChoresContext = createContext();

// Custom hook to use the ChoresContext
export const useChores = () => useContext(ChoresContext);

// ChoresContextProvider component
export const ChoresProvider = ({ children }) => {
  const [chores, setChores] = useState([]); // Store chores
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const backendUrl = "http://localhost:8081/api/chores"; // Backend base URL for chore management

  // Fetch chores from the backend
  const fetchChores = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch chores.");
      }

      const choresData = await response.json();
      setChores(choresData); // Update state with fetched chores
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new chore
  const addChore = async (chore) => {
    try {
      setError(null);

      const response = await fetch(`${backendUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chore), // Send the new chore data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add chore.");
      }

      const newChore = await response.json();
      setChores((prevChores) => [...prevChores, newChore]); // Add the new chore to the state
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing chore
  const updateChore = async (id, updatedChore) => {
    try {
      setError(null);

      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChore), // Send the updated chore data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update chore.");
      }

      const updatedData = await response.json();
      setChores((prevChores) =>
        prevChores.map((chore) => (chore.id === id ? updatedData : chore))
      ); // Update the state with the updated chore
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a chore
  const deleteChore = async (id) => {
    try {
      setError(null);

      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete chore.");
      }

      setChores((prevChores) => prevChores.filter((chore) => chore.id !== id)); // Remove the deleted chore from state
    } catch (err) {
      setError(err.message);
    }
  };

  // Load chores on component mount
  useEffect(() => {
    fetchChores();
  }, []);

  // Context value
  const value = {
    chores,
    loading,
    error,
    fetchChores,
    addChore,
    updateChore,
    deleteChore,
  };

  return <ChoresContext.Provider value={value}>{children}</ChoresContext.Provider>;
};
