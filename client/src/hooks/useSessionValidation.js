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
          console.warn("[Session Validation] Missing sessionId or userId:", { 
            sessionId: sessionId ? sessionId.substring(0, 10) + "..." : null, 
            userId,
            sessionDataKeys: Object.keys(parsedData)
          });
          onSessionInvalid();
          return;
        }
        
        console.log("[Session Validation] Checking session:", {
          userId,
          sessionIdPreview: sessionId.substring(0, 10) + "..."
        });

        // Check session status with backend
        const response = await axios.post(`${url}/login/check-session`, {
          sessionId,
          userId,
        });

        // If session is invalid, trigger logout
        if (!response.data.success || !response.data.isValid) {
          console.warn("[Session Validation] Session invalid:", {
            success: response.data.success,
            isValid: response.data.isValid,
            message: response.data.message,
            sessionIdPreview: sessionId.substring(0, 10) + "...",
            userId
          });
          onSessionInvalid();
        } else {
          console.log("[Session Validation] ✅ Session valid");
        }
      } catch (error) {
        // Handle different error scenarios
        if (error.response?.status === 401) {
          console.warn("[Session Validation] 401 Unauthorized - session invalid");
          onSessionInvalid();
        } else if (error.response?.data?.sessionInvalid) {
          console.warn("[Session Validation] Backend indicated session invalid");
          onSessionInvalid();
        } else if (error.response?.status >= 500) {
          // Server errors - don't logout, might be temporary
          console.error("[Session Validation] Server error (not logging out):", error.response?.status);
        } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
          // Network issues - don't logout
          console.warn("[Session Validation] Network error (not logging out)");
        } else {
          // For other errors, don't logout (might be temporary issue)
          console.error("[Session Validation] Error (not logging out):", error.message);
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Delay initial check to allow React state to fully update after login
    // This prevents race conditions where validation runs before sessionId is saved
    const initialCheckTimeout = setTimeout(() => {
      checkSessionStatus();
    }, 1000); // 1 second delay after component mounts

    // Set up polling interval
    intervalRef.current = setInterval(checkSessionStatus, interval);

    // Cleanup function
    return () => {
      clearTimeout(initialCheckTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isCheckingRef.current = false;
    };
  }, [enabled, interval, onSessionInvalid]);
};

export default useSessionValidation;

