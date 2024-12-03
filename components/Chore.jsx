import React, { useState, useEffect } from 'react';
import './Chore.css';
import { formatDate } from '../helpers/dateUtils'; // Utility for date formatting
import { Link } from 'react-router-dom';

function Chore() {
  const [chores, setChores] = useState([]);
  const [selectedDay, setSelectedDay] = useState(formatDate(new Date(), 'EEEE')); // Default to today's day
  const [filter, setFilter] = useState(null); // Current filter selection
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const backendUrl = 'http://localhost:8081/api/chores'; // Backend endpoint

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch chores for the selected day
  useEffect(() => {
    const fetchChores = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${backendUrl}?day=${selectedDay}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chores.');
        }
        const data = await response.json();
        setChores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChores();
  }, [selectedDay]);

  // Filter chores based on filter type
  const handleFilter = async (filterType) => {
    setFilter(filterType);
    try {
      const response = await fetch(`${backendUrl}/filter?filter=${filterType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered chores.');
      }
      const data = await response.json();
      setChores(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark a chore as completed
  const completeChore = async (choreId) => {
    try {
      const response = await fetch(`${backendUrl}/${choreId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }), // Format database entry
      });
      if (!response.ok) {
        throw new Error('Failed to mark chore as completed.');
      }
      const updatedChore = await response.json();
      setChores((prevChores) =>
        prevChores.map((chore) => (chore.id === updatedChore.id ? updatedChore : chore))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chore-page">
      <header className="chore-header">
        <h1 className="chore-title">ACE</h1>
        <h2 className="chore-subtitle">Chore Planner</h2>
        <p className="chore-description">
          Quickly access and manage household tasks. Make task management streamlined and efficient.
        </p>
      </header>

      {/* Error and Loading States */}
      {error && <p className="chore-error">{error}</p>}
      {loading && <p className="chore-loading">Loading tasks...</p>}

      {/* Weekly Overview Section */}
      <div className="week-overview">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className={`day-card ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <div className="day-placeholder"></div>
            <p className="day-name">{day}</p>
            <span className="see-more">See More &gt;</span>
          </div>
        ))}
      </div>

      {/* Chore List Section */}
      <div className="chore-list-section">
        <h2 className="chore-list-title">Today's Chore List - {selectedDay}</h2>
        <div className="chore-list">
          {chores.length > 0 ? (
            chores.map((chore) => (
              <div key={chore.id} className="chore-item">
                <span className="task-name">{chore.name}</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${chore.progress}%` }}></div>
                </div>
                {chore.status !== 'Completed' && (
                  <button
                    className="complete-button"
                    onClick={() => completeChore(chore.id)}
                  >
                    Mark as Done
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-tasks">No tasks available for {selectedDay}</p>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <div className="filter-options">
        <div className="filter-card" onClick={() => handleFilter('priority')}>
          <div className="filter-placeholder"></div>
          <p className="filter-title">Filter By Priority</p>
          <span className="see-more">See More &gt;</span>
        </div>
        <div className="filter-card" onClick={() => handleFilter('deadline')}>
          <div className="filter-placeholder"></div>
          <p className="filter-title">Filter By Deadline</p>
          <span className="see-more">See More &gt;</span>
        </div>
        <div className="filter-card" onClick={() => handleFilter('self')}>
          <div className="filter-placeholder"></div>
          <p className="filter-title">Highlight Tasks For Self</p>
          <span className="see-more">See More &gt;</span>
        </div>
      </div>

      <button className="main-menu-button" onClick={() => (window.location.href = '/')}>
        Return To Main Menu
      </button>

      {/* Footer */}
      <footer className="chore-footer">
        <Link to="/contact">Contact</Link>
        <Link to="/community">Community</Link>
        <Link to="/company">Company</Link>
        <Link to="/help">Help desk</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/resources">Resources</Link>
      </footer>
    </div>
  );
}

export default Chore;