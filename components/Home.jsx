import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Hook for managing user authentication
import { formatDate } from '../helpers/dateUtils'; // Utility for date handling

function Home() {
  const { user } = useAuth(); // Retrieve authenticated user information
  const [tasks, setTasks] = useState([]); // Tasks for the current day
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDay, setCurrentDay] = useState(formatDate(new Date(), 'EEEE')); // Format day as "Monday", "Tuesday", etc.
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = 'http://localhost:8081/api/tasks'; // Backend endpoint for tasks

  // Fetch tasks for the current day from the backend
  useEffect(() => {
    const fetchTasksForToday = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${backendUrl}?day=${currentDay}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include auth token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks for today.');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksForToday();
  }, [currentDay]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTimerChange = (e) => {
    const { name, value } = e.target;
    setTimer((prevTimer) => ({
      ...prevTimer,
      [name]: Math.max(0, Math.min(parseInt(value) || 0, name === 'hours' ? 23 : 59)), // Restrict hours (0-23) and minutes/seconds (0-59)
    }));
  };

  const startQuickTimer = () => {
    console.log('Timer started:', timer);
    // Additional timer functionality can be added here
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Smart Chore Planner</h1>
      </header>

      <div className="welcome-section">
        <h2>Welcome Back, {user?.name || 'User'}</h2>
        <p>Thank you for choosing to live your most efficient life.</p>
        <p>Your calendar at your fingertips.</p>
      </div>

      <div className="tasks-section">
        <div className="tasks-box">
          <h3>Tasks For The Day: {currentDay}</h3>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="error-message">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No tasks for today</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="search-timer-section">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Functions"
          />
          <button className="search-icon">🔍</button>
        </div>

        <div className="timer-section">
          <div className="timer-display">
            <input
              type="number"
              name="hours"
              value={timer.hours}
              onChange={handleTimerChange}
              placeholder="00"
            />
            <span>:</span>
            <input
              type="number"
              name="minutes"
              value={timer.minutes}
              onChange={handleTimerChange}
              placeholder="00"
            />
            <span>:</span>
            <input
              type="number"
              name="seconds"
              value={timer.seconds}
              onChange={handleTimerChange}
              placeholder="00"
            />
          </div>
          <button onClick={startQuickTimer}>Set Quick Timer</button>
        </div>
      </div>

      <div className="info-sections">
        <div className="info-box">
          <h3>Chores</h3>
          <p>
            Allows users to quickly access and manage their list of household tasks. By tapping this button, users can view, filter, and prioritize chores, making task management streamlined and efficient.
          </p>
          <Link to="/chores" className="learn-more-button">Learn more</Link>
        </div>
        <div className="info-box">
          <h3>Calendar</h3>
          <p>
            Provides users with an overview of scheduled chores and important dates. By tapping the button, users can easily track upcoming tasks, set reminders, and ensure timely completion of chores.
          </p>
          <Link to="/calendar" className="learn-more-button">Learn more</Link>
        </div>
        <div className="info-box">
          <h3>Settings</h3>
          <p>
            Allows users to customize their Smart Chore Planner experience. Users can adjust preferences such as notification settings, manage accounts, and update profile information.
          </p>
          <Link to="/settings" className="learn-more-button">Learn more</Link>
        </div>
      </div>

      <footer className="home-footer">
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

export default Home;
