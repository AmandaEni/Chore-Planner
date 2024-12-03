import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage a timer with backend integration
 */
const useTimer = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 }); // Timer state
  const [isRunning, setIsRunning] = useState(false); // Running state
  const [timerId, setTimerId] = useState(null); // Interval ID
  const [error, setError] = useState(null); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    // Cleanup on unmount to prevent memory leaks
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  /**
   * Start the timer
   */
  const startTimer = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    const id = setInterval(() => {
      setTime((prevTime) => {
        const totalSeconds =
          prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1;

        if (totalSeconds <= 0) {
          clearInterval(id);
          setIsRunning(false);
          saveTimerData(prevTime); // Save final state to the backend
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    setTimerId(id);
  }, [isRunning]);

  /**
   * Pause the timer
   */
  const pauseTimer = useCallback(() => {
    if (!isRunning) return;

    clearInterval(timerId);
    setTimerId(null);
    setIsRunning(false);
  }, [isRunning, timerId]);

  /**
   * Reset the timer
   */
  const resetTimer = useCallback(() => {
    clearInterval(timerId);
    setTimerId(null);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(false);
  }, [timerId]);

  /**
   * Set timer time manually
   * @param {Object} newTime - New timer values
   * @param {number} newTime.hours
   * @param {number} newTime.minutes
   * @param {number} newTime.seconds
   */
  const setManualTime = useCallback(
    (newTime) => {
      if (isRunning) return; // Prevent changes while running

      setTime({
        hours: Math.max(0, Math.min(newTime.hours || 0, 23)),
        minutes: Math.max(0, Math.min(newTime.minutes || 0, 59)),
        seconds: Math.max(0, Math.min(newTime.seconds || 0, 59)),
      });
    },
    [isRunning]
  );

  /**
   * Save timer data to the backend
   * @param {Object} timerData - Timer data to save
   */
  const saveTimerData = async (timerData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8081/api/timer/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hours: timerData.hours,
          minutes: timerData.minutes,
          seconds: timerData.seconds,
          timestamp: new Date().toISOString(), // Include a timestamp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save timer data.");
      }

      console.log("Timer data saved successfully");
    } catch (err) {
      console.error("Error saving timer data:", err);
      setError(err.message || "Failed to save timer data.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch timer data from the backend
   */
  const fetchTimerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8081/api/timer/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch timer data.");
      }

      const timerData = await response.json();
      const { hours, minutes, seconds } = timerData;

      setTime({ hours, minutes, seconds });
    } catch (err) {
      console.error("Error fetching timer data:", err);
      setError(err.message || "Failed to fetch timer data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    time,
    isRunning,
    error,
    loading,
    startTimer,
    pauseTimer,
    resetTimer,
    setManualTime,
    fetchTimerData,
  };
};

export default useTimer;
