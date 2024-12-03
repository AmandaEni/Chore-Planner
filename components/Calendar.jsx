import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Calendar.css';
import { formatDate } from '../helpers/dateUtils'; // Reusing date utility

function Calendar() {
  const [chores, setChores] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current date for the calendar
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const backendUrl = 'http://localhost:8081/api/chores'; // Adjust backend endpoint as needed

  // Fetch chores dynamically based on the current date
  useEffect(() => {
    const fetchChores = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}?date=${currentDate.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch chores');
        const data = await response.json();
        setChores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChores();
  }, [currentDate]);

  // Add a new task
  const handleAddTask = async () => {
    const title = prompt('Enter task title:');
    const day = prompt('Enter day of the week (e.g., Monday):');
    const time = prompt('Enter time (e.g., 14:00):');
    const priority = prompt('Enter priority (High, Medium, Low):');

    if (title && day && time && priority) {
      try {
        const newTask = { title, day, time, priority, date: currentDate.toISOString() };
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) throw new Error('Failed to add task');
        const addedTask = await response.json();
        setChores((prev) => [...prev, addedTask]);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Remove a task
  const handleRemoveTask = async () => {
    if (selectedTask) {
      try {
        const response = await fetch(`${backendUrl}/${selectedTask.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to remove task');
        setChores((prev) => prev.filter((chore) => chore.id !== selectedTask.id));
        setSelectedTask(null);
      } catch (err) {
        setError(err.message);
      }
    } else {
      alert('Please select a task to remove.');
    }
  };

  // Update task details
  const updateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${backendUrl}/${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setChores((prev) => prev.map((chore) => (chore.id === updated.id ? updated : chore)));
      setSelectedTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Move a task
  const handleMoveTask = async () => {
    if (selectedTask) {
      const newDay = prompt('Enter new day of the week:', selectedTask.day);
      const newTime = prompt('Enter new time:', selectedTask.time);

      if (newDay && newTime) {
        const updatedTask = { ...selectedTask, day: newDay, time: newTime };
        await updateTask(updatedTask);
      }
    } else {
      alert('Please select a task to move.');
    }
  };

  // Update task priority
  const handleUpdatePriority = async () => {
    if (selectedTask) {
      const newPriority = prompt('Enter new priority (High, Medium, Low):', selectedTask.priority);

      if (newPriority) {
        const updatedTask = { ...selectedTask, priority: newPriority };
        await updateTask(updatedTask);
      }
    } else {
      alert('Please select a task to update priority.');
    }
  };

  // Update task classification
  const handleUpdateClassification = async () => {
    if (selectedTask) {
      const newClassification = prompt('Enter task classification (e.g., Work, Personal):');

      if (newClassification) {
        const updatedTask = { ...selectedTask, classification: newClassification };
        await updateTask(updatedTask);
      }
    } else {
      alert('Please select a task to update classification.');
    }
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h1 className="calendar-title">ACE</h1>
        <h2 className="calendar-subtitle">Calendar</h2>
        <p className="calendar-description">
          Schedule chores and important dates. Track tasks, set reminders, and manage your schedule effectively.
        </p>
      </header>

      {error && <p className="calendar-error">{error}</p>}
      {loading && <p className="calendar-loading">Loading tasks...</p>}

      <div className="calendar-content">
        <div className="task-menu">
          <h3>Task Menu</h3>
          <button className="task-button" onClick={handleAddTask}>
            📝 Add New Task
          </button>
          <button className="task-button" onClick={handleRemoveTask}>
            🗑️ Remove Task
          </button>
          <button className="task-button" onClick={handleMoveTask}>
            📅 Move Task Date
          </button>
          <button className="task-button" onClick={handleUpdatePriority}>
            ⚙️ Update Priority
          </button>
          <button className="task-button" onClick={handleUpdateClassification}>
            📊 Update Classification
          </button>
        </div>

        <div className="calendar-view">
          <h2 className="month-year">{formatDate(currentDate, { month: 'long', year: 'numeric' })}</h2>
          <div className="weekdays">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="weekday">
                <span className="day-name">{day}</span>
              </div>
            ))}
          </div>
          <div className="hours-column">
            {hours.map((hour, index) => (
              <div key={index} className="hour-label">
                {hour}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {daysOfWeek.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {hours.map((hour, hourIndex) => {
                  const task = chores.find((chore) => chore.time === hour && chore.day === day);
                  return (
                    <div
                      key={hourIndex}
                      className={`calendar-cell ${task ? 'task-cell' : ''}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      {task && <span>{task.title}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link to="/" className="main-menu-button">
        Return To Main Menu
      </Link>

      <footer className="calendar-footer">
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

export default Calendar;
