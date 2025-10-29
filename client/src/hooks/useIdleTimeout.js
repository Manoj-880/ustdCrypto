/**
 * useIdleTimeout Hook
 * 
 * Custom React hook that automatically logs out users after a specified
 * period of inactivity. Tracks user activity including mouse movement,
 * keyboard input, touch events, scrolling, and visibility changes.
 * 
 * Features:
 * - Detects user activity across multiple event types
 * - Resets timer on any user interaction
 * - Automatically logs out after idle timeout
 * - Only active when user is logged in
 * 
 * @param {number} timeout - Idle timeout in milliseconds (default: 10 minutes)
 * @param {Function} onIdle - Callback function when idle timeout is reached
 * @param {boolean} enabled - Whether the idle detection is enabled
 * 
 * @example
 * const { user, logout } = useAuth();
 * useIdleTimeout(10 * 60 * 1000, logout, !!user);
 */

import { useEffect, useRef } from 'react';

const useIdleTimeout = (timeout, onIdle, enabled = true) => {
  const timeoutIdRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const onIdleRef = useRef(onIdle);
  const enabledRef = useRef(enabled);

  // Keep refs up to date
  useEffect(() => {
    onIdleRef.current = onIdle;
    enabledRef.current = enabled;
  }, [onIdle, enabled]);

  const clearExistingTimeout = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const resetTimer = () => {
    if (!enabledRef.current) return;

    clearExistingTimeout();
    lastActivityRef.current = Date.now();

    // Set new timeout
    timeoutIdRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Double-check that we're still idle and enabled
      if (timeSinceLastActivity >= timeout && enabledRef.current) {
        onIdleRef.current();
      }
    }, timeout);
  };

  useEffect(() => {
    if (!enabled) {
      clearExistingTimeout();
      return;
    }

    // Initialize timer
    resetTimer();

    // List of events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
      'wheel',
      'resize'
    ];

    // Event handler that resets the timer
    const handleActivity = () => {
      resetTimer();
    };

    // Listen for visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs/windows, pause timer
        clearExistingTimeout();
      } else {
        // User returned, reset timer
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity, true);
    });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      clearExistingTimeout();
      events.forEach(event => {
        window.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeout, enabled]);
};

export default useIdleTimeout;

