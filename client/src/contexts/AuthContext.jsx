/**
 * Authentication Context - USDT Investment Platform
 * 
 * This context provides authentication state management for the entire application.
 * It handles user sessions, role-based access control, and session persistence
 * using localStorage for seamless user experience across browser sessions.
 * 
 * Key Features:
 * - User authentication state management
 * - Role-based access control (user/admin)
 * - Session persistence with localStorage
 * - Automatic session expiry handling
 * - Legacy session format migration
 * - Session validation and cleanup
 * 
 * Session Management:
 * - Sessions expire after 24 hours
 * - Automatic cleanup of expired sessions
 * - Legacy format migration for backward compatibility
 * - Role enforcement and validation
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * 
 * This hook provides access to the authentication context and ensures
 * it's only used within an AuthProvider component.
 * 
 * @returns {Object} Authentication context with user data and methods
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication Provider Component
 * 
 * This component wraps the entire application and provides authentication
 * state and methods to all child components through React Context.
 * 
 * State Management:
 * - user: Current authenticated user data
 * - userRole: User's role (user/admin)
 * - isLoading: Loading state during authentication checks
 * 
 * Session Features:
 * - 24-hour session expiry
 * - Automatic session validation
 * - Legacy format migration
 * - Role enforcement and defaults
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Authentication context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Validate Session Expiry
   * 
   * Checks if a session is still valid based on its timestamp.
   * Sessions expire after 24 hours for security purposes.
   * 
   * @param {Object} sessionData - Session data object
   * @param {string} sessionData.timestamp - Session creation timestamp
   * @returns {boolean} True if session is valid, false if expired
   */
  const isSessionValid = (sessionData) => {
    if (!sessionData) return false;

    const now = new Date().getTime();
    const sessionTime = new Date(sessionData.timestamp).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return now - sessionTime < twentyFourHours;
  };

  /**
   * Retrieve User Session from localStorage
   * 
   * Attempts to retrieve and validate the user session from localStorage.
   * Handles session expiry, data corruption, and legacy format migration.
   * 
   * Process Flow:
   * 1. Retrieve session data from localStorage
   * 2. Parse JSON data safely
   * 3. Validate session expiry
   * 4. Ensure role is present (default to 'user')
   * 5. Return validated session or null
   * 
   * @returns {Object|null} Valid session data or null if invalid/expired
   */
  const getUserFromSession = () => {
    try {
      const sessionData = localStorage.getItem("userSession");

      if (sessionData) {
        const parsedData = JSON.parse(sessionData);

        if (isSessionValid(parsedData)) {
          const role = parsedData.role || "user";
          return {
            user: parsedData.user,
            role: role,
          };
        } else {
          localStorage.removeItem("userSession");
        }
      }
    } catch (error) {
      console.error("Error reading from local storage:", error);
      localStorage.removeItem("userSession");
    }
    return null;
  };

  /**
   * Store User Session in localStorage
   * 
   * Saves user data and role to localStorage with a timestamp for session management.
   * Ensures role is always present and defaults to 'user' if not specified.
   * Also stores sessionId for single-device login enforcement.
   * 
   * @param {Object} userData - User data object
   * @param {string} role - User role (user/admin)
   * @param {string} sessionId - Session ID from backend (optional)
   */
  const setUserInSession = (userData, role, sessionId) => {
    try {
      const finalRole = role || 'user';
      
      // Preserve existing sessionId if new one is not provided and we're updating
      let finalSessionId = sessionId;
      if (!finalSessionId) {
        try {
          const existingSession = localStorage.getItem("userSession");
          if (existingSession) {
            const parsed = JSON.parse(existingSession);
            finalSessionId = parsed.sessionId || null;
          }
        } catch (e) {
          // Ignore errors when reading existing session
        }
      }
      
      const sessionData = {
        user: userData,
        role: finalRole,
        timestamp: new Date().toISOString(),
        sessionId: finalSessionId, // Store sessionId for single-device login
      };
      localStorage.setItem("userSession", JSON.stringify(sessionData));
      console.log("✅ [AuthContext] Session saved with sessionId:", finalSessionId ? finalSessionId.substring(0, 10) + "..." : "null");
      setUser(userData);
      setUserRole(finalRole);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  /**
   * Clear User Session
   * 
   * Removes user session from localStorage and resets authentication state.
   * Used for logout functionality and session cleanup.
   */
  const clearUserSession = () => {
    try {
      localStorage.removeItem("userSession");
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  /**
   * Initialize Authentication State
   * 
   * This effect runs on component mount to check for existing sessions
   * and initialize the authentication state. It handles:
   * - Session validation and restoration
   * - Legacy format migration
   * - Role enforcement and defaults
   * - Session cleanup for invalid data
   */
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const sessionData = getUserFromSession();

      if (sessionData) {
        setUser(sessionData.user);
        const role = sessionData.role || "user";
        setUserRole(role);

        const currentSession = JSON.parse(localStorage.getItem("userSession"));
        if (currentSession) {
          // Ensure role and sessionId are preserved
          const needsUpdate = !currentSession.role || !currentSession.sessionId;
          if (needsUpdate) {
            const updatedSession = {
              ...currentSession,
              role: currentSession.role || "user",
              // Preserve existing sessionId if present, don't overwrite it
              sessionId: currentSession.sessionId || null,
            };
            localStorage.setItem("userSession", JSON.stringify(updatedSession));
            if (!currentSession.role) {
              setUserRole("user");
            }
          }
        }
      } else {
        const directUserData = localStorage.getItem("userSession");
        if (directUserData) {
          try {
            const parsedUser = JSON.parse(directUserData);
            if (parsedUser._id && parsedUser.email && !parsedUser.user) {
              // Preserve existing sessionId if present
              const existingSessionId = parsedUser.sessionId || null;
              const newSessionData = {
                user: parsedUser,
                role: "user",
                timestamp: new Date().toISOString(),
                sessionId: existingSessionId, // Preserve sessionId during migration
              };
              localStorage.setItem(
                "userSession",
                JSON.stringify(newSessionData)
              );
              setUser(parsedUser);
              setUserRole("user");
            }
          } catch (error) {
            console.error("Error parsing legacy user data:", error);
            setUser(null);
            setUserRole(null);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  /**
   * Automatic Session Expiry Monitoring
   * 
   * This effect monitors session expiry and automatically logs out users
   * when their session expires. It runs every minute to check session validity.
   */
  useEffect(() => {
    if (user) {
      const checkSessionExpiry = () => {
        const sessionData = localStorage.getItem("userSession");
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          if (!isSessionValid(parsedData)) {
            clearUserSession();
          }
        }
      };

      const interval = setInterval(checkSessionExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  /**
   * Role Checking Helper Functions
   * 
   * These functions provide convenient ways to check user roles
   * for conditional rendering and access control.
   * 
   * @param {string} role - Role to check for
   * @returns {boolean} True if user has the specified role
   */
  const hasRole = (role) => userRole === role;
  const hasAnyRole = (roles) => roles.includes(userRole);

  /**
   * Force Session Clear and Reload
   * 
   * Clears the current session and reloads the page to force
   * a fresh authentication state. Used for debugging and
   * session troubleshooting.
   */
  const clearCurrentSession = () => {
    clearUserSession();
    window.location.reload();
  };

  /**
   * Force Session Update with Role
   * 
   * Forces an update to the current session to ensure role
   * is present and reloads the page. Used for legacy session
   * migration and role enforcement.
   */
  const forceUpdateSessionWithRole = () => {
    const currentSession = JSON.parse(localStorage.getItem("userSession"));
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        role: "user",
      };
      localStorage.setItem("userSession", JSON.stringify(updatedSession));
      setUserRole("user");
      window.location.reload();
    }
  };

  /**
   * Context Value Object
   * 
   * This object contains all the authentication state and methods
   * that are provided to child components through the context.
   */
  const value = {
    user,
    userRole,
    isLoading,
    login: setUserInSession,
    logout: clearUserSession,
    clearCurrentSession,
    forceUpdateSessionWithRole,
    isAuthenticated: !!user,
    isAdmin: userRole === "admin",
    isUser: userRole === "user",
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};