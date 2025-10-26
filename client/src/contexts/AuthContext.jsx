/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if session is valid
  const isSessionValid = (sessionData) => {
    if (!sessionData) return false;

    const now = new Date().getTime();
    const sessionTime = new Date(sessionData.timestamp).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    return now - sessionTime < twentyFourHours;
  };

  // Get user from local storage
  const getUserFromSession = () => {
    try {
      const sessionData = localStorage.getItem("userSession");
      console.log("Raw localStorage data:", sessionData);

      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        console.log("Parsed session data:", parsedData);

        if (isSessionValid(parsedData)) {
          // Always ensure role exists, default to 'user' if missing
          const role = parsedData.role || "user";
          console.log("Session valid, role:", role);
          return {
            user: parsedData.user,
            role: role,
          };
        } else {
          // Session expired, clear it
          console.log("Session expired, clearing localStorage");
          localStorage.removeItem("userSession");
        }
      }
    } catch (error) {
      console.error("Error reading from local storage:", error);
      localStorage.removeItem("userSession");
    }
    return null;
  };

  // Set user in local storage
  const setUserInSession = (userData, role) => {
    try {
      console.log("setUserInSession called with:");
      console.log("userData:", userData);
      console.log("role:", role);
      console.log("role type:", typeof role);
      
      // Ensure role is always set, default to 'user' if undefined
      const finalRole = role || 'user';
      console.log("Final role after fallback:", finalRole);
      
      const sessionData = {
        user: userData,
        role: finalRole,
        timestamp: new Date().toISOString(),
      };
      console.log("Setting user in session with role:", finalRole);
      console.log("Session data:", sessionData);
      localStorage.setItem("userSession", JSON.stringify(sessionData));
      setUser(userData);
      setUserRole(finalRole);
      console.log("User and role set successfully");
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  // Clear user session
  const clearUserSession = () => {
    try {
      localStorage.removeItem("userSession");
      setUser(null);
      setUserRole(null);
      console.log("Session cleared successfully");
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const sessionData = getUserFromSession();
      console.log("Raw session data:", sessionData);

      if (sessionData) {
        setUser(sessionData.user);
        // Handle legacy sessions without role - default to 'user' role
        const role = sessionData.role || "user";
        console.log("Session data role:", sessionData.role);
        console.log("Assigned role:", role);
        setUserRole(role);

        // ALWAYS update the session to ensure role is present
        const currentSession = JSON.parse(localStorage.getItem("userSession"));
        if (currentSession) {
          if (!currentSession.role) {
            console.log("FORCING role addition to session");
            const updatedSession = {
              ...currentSession,
              role: "user",
            };
            localStorage.setItem("userSession", JSON.stringify(updatedSession));
            console.log("FORCED update completed:", updatedSession);
            setUserRole("user");
          } else {
            console.log("Session already has role:", currentSession.role);
          }
        }
      } else {
        // Check if there's a direct user object in localStorage (legacy format)
        const directUserData = localStorage.getItem("userSession");
        if (directUserData) {
          try {
            const parsedUser = JSON.parse(directUserData);
            // If it's a user object directly (not wrapped in session structure)
            if (parsedUser._id && parsedUser.email && !parsedUser.user) {
              console.log(
                "Detected legacy direct user format, converting to new format"
              );
              const newSessionData = {
                user: parsedUser,
                role: "user",
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem(
                "userSession",
                JSON.stringify(newSessionData)
              );
              setUser(parsedUser);
              setUserRole("user");
              console.log("Converted legacy session:", newSessionData);
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

  // Auto-logout when session expires
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

      // Check every minute
      const interval = setInterval(checkSessionExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Helper functions for role checking
  const hasRole = (role) => userRole === role;
  const hasAnyRole = (roles) => roles.includes(userRole);

  // Temporary function to clear current session and force fresh login
  const clearCurrentSession = () => {
    console.log("Clearing current session to force fresh login...");
    clearUserSession();
    window.location.reload();
  };

  // Force update current session with role
  const forceUpdateSessionWithRole = () => {
    console.log("Force updating current session with role...");
    const currentSession = JSON.parse(localStorage.getItem("userSession"));
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        role: "user",
      };
      localStorage.setItem("userSession", JSON.stringify(updatedSession));
      setUserRole("user");
      console.log("Session force updated:", updatedSession);
      window.location.reload();
    }
  };

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
