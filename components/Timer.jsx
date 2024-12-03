import React, { useState, useEffect } from 'react';
import './Timer.css';
import { useAuth } from '../hooks/useAuth'; // Authentication hook for user context
import { useChores } from '../contexts/ChoresContext'; // Chores context for task data

function Timer() {
  const { user } = useAuth(); // Get authenticated user details
  const { tasks, fetchTasks } = useChores(); // Access tasks and fetch function from ChoresContext
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [taskId, setTaskId] = useState(''); // Track the selected task for the timer
  const backendUrl = "http://localhost:8081/api"; // Base URL for backend API

  // Fetch tasks when the component mounts
  useEffect(() => {
    if (user) {
      fetchTasks(user.id);
    }
  }, [user, fetchTasks]);

  // Timer logic: decrement the timer every second when running
  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => {
          const totalSeconds =
            prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1;

          if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            handleTimerComplete();
            return { hours: 0, minutes: 0, seconds: 0 };
          }

          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return { hours, minutes, seconds };
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning]);

  const handleTimerStart = async () => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      alert('Please set a valid time before starting the timer.');
      return;
    }

    if (!taskId) {
      alert('Please select a task to associate with the timer.');
      return;
    }

    setIsRunning(true);

    try {
      const response = await fetch(`${backendUrl}/tasks/${taskId}/start-timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Pass token for authentication
        },
        body: JSON.stringify({ time }), // Send timer data
      });

      if (!response.ok) {
        throw new Error('Failed to start the timer.');
      }

      console.log('Timer started');
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleTimerPause = async () => {
    setIsRunning(false);

    try {
      const response = await fetch(`${backendUrl}/tasks/${taskId}/pause-timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ time }),
      });

      if (!response.ok) {
        throw new Error('Failed to pause the timer.');
      }

      console.log('Timer paused');
    } catch (error) {
      console.error('Error pausing timer:', error);
    }
  };

  const handleTimerReset = async () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });

    try {
      const response = await fetch(`${backendUrl}/tasks/${taskId}/reset-timer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset the timer.');
      }

      console.log('Timer reset');
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    alert('Time is up!');

    try {
      const response = await fetch(`${backendUrl}/tasks/${taskId}/complete-timer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete the timer.');
      }

      console.log('Timer completed');
    } catch (error) {
      console.error('Error completing timer:', error);
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Math.min(parseInt(value) || 0, name === 'hours' ? 99 : 59));
    setTime((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <div className="timer-container">
      <h2>Task Timer</h2>

      <div className="task-selector">
        <label htmlFor="task">Select Task:</label>
        <select
          id="task"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          disabled={isRunning}
        >
          <option value="" disabled>
            -- Select a Task --
          </option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </select>
      </div>

      <div className="timer-display">
        <input
          type="number"
          name="hours"
          value={time.hours}
          onChange={handleTimeChange}
          disabled={isRunning}
          placeholder="HH"
        />
        <span>:</span>
        <input
          type="number"
          name="minutes"
          value={time.minutes}
          onChange={handleTimeChange}
          disabled={isRunning}
          placeholder="MM"
        />
        <span>:</span>
        <input
          type="number"
          name="seconds"
          value={time.seconds}
          onChange={handleTimeChange}
          disabled={isRunning}
          placeholder="SS"
        />
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleTimerStart}>Start</button>
        ) : (
          <button onClick={handleTimerPause}>Pause</button>
        )}
        <button onClick={handleTimerReset} disabled={isRunning}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
