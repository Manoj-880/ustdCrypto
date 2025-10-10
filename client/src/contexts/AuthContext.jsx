import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if session is valid
  const isSessionValid = (sessionData) => {
    if (!sessionData) return false;
    
    const now = new Date().getTime();
    const sessionTime = new Date(sessionData.timestamp).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return (now - sessionTime) < twentyFourHours;
  };

  // Get user from local storage
  const getUserFromSession = () => {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        if (isSessionValid(parsedData)) {
          return parsedData.user;
        } else {
          // Session expired, clear it
          localStorage.removeItem('userSession');
        }
      }
    } catch (error) {
      console.error('Error reading from local storage:', error);
      localStorage.removeItem('userSession');
    }
    return null;
  };

  // Set user in local storage
  const setUserInSession = (userData) => {
    try {
      const sessionData = {
        user: userData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  // Clear user session
  const clearUserSession = () => {
    try {
      localStorage.removeItem('userSession');
      setUser(null);
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const userData = getUserFromSession();
      setUser(userData);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (user) {
      const checkSessionExpiry = () => {
        const sessionData = localStorage.getItem('userSession');
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

  const value = {
    user,
    isLoading,
    login: setUserInSession,
    logout: clearUserSession,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
