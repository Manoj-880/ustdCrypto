/**
 * useSessionValidation Hook
 * 
 * Custom React hook that periodically validates the user's session to detect
 * if they've been logged out from another device. If the session is invalid,
 * it automatically logs out the user and redirects to login.
 * 
 * @param {Function} onSessionInvalid - Callback when session is invalid
 * @param {boolean} enabled - Whether session validation is enabled
 * @param {number} interval - Polling interval in milliseconds (default: 30 seconds)
 * 
 * @example
 * const { user, logout } = useAuth();
 * useSessionValidation(
 *   () => {
 *     logout();
 *     toast.warning("Logged out: Another device logged in");
 *     navigate("/login");
 *   },
 *   !!user,
 *   30000
 * );
 */

import { useEffect, useRef } from 'react';
import axios from 'axios';
import { url } from '../constants';

const useSessionValidation = (onSessionInvalid, enabled = true, interval = 30000) => {
  const intervalRef = useRef(null);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      // Clear any existing interval if disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    /**
     * Check session status with the backend
     */
    const checkSessionStatus = async () => {
      // Prevent multiple simultaneous checks
      if (isCheckingRef.current) return;
      
      try {
        isCheckingRef.current = true;
        
        // Get session data from localStorage
        const sessionData = localStorage.getItem("userSession");
        if (!sessionData) {
          // No session data, trigger logout
          onSessionInvalid();
          return;
        }

        const parsedData = JSON.parse(sessionData);
        const sessionId = parsedData.sessionId;
        const userId = parsedData.user?._id || parsedData.user?.id;

        // If no sessionId or userId, session is invalid
        if (!sessionId || !userId) {
          onSessionInvalid();
          return;
        }

        // Check session status with backend
        const response = await axios.post(`${url}/login/check-session`, {
          sessionId,
          userId,
        });

        // If session is invalid, trigger logout
        if (!response.data.success || !response.data.isValid) {
          onSessionInvalid();
        }
      } catch (error) {
        // On error (network or 401), check if it's a session invalidation
        if (error.response?.status === 401 || error.response?.data?.sessionInvalid) {
          onSessionInvalid();
        } else {
          // For other errors, don't logout (might be network issue)
          console.error("Session validation error:", error);
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Initial check
    checkSessionStatus();

    // Set up polling interval
    intervalRef.current = setInterval(checkSessionStatus, interval);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isCheckingRef.current = false;
    };
  }, [enabled, interval, onSessionInvalid]);
};

export default useSessionValidation;

