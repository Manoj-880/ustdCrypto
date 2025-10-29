/**
 * Axios Configuration
 * 
 * This file configures axios to automatically include sessionId and userId
 * in the headers of all authenticated requests. It sets up interceptors
 * on the default axios instance so all API calls automatically include
 * session information.
 */

import axios from "axios";
import { url } from "../constants";

// Set default base URL for axios
axios.defaults.baseURL = url;

// Request interceptor to add sessionId and userId to headers
axios.interceptors.request.use(
  (config) => {
    // Get session data from localStorage
    try {
      const sessionData = localStorage.getItem("userSession");
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        
        // Add sessionId to headers if available
        if (parsedData.sessionId) {
          config.headers["X-Session-ID"] = parsedData.sessionId;
        }
        
        // Add userId to headers if available
        if (parsedData.user?._id || parsedData.user?.id) {
          config.headers["X-User-ID"] = parsedData.user._id || parsedData.user.id;
        }
      }
    } catch (error) {
      console.error("Error reading session data:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session invalidation
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 responses (session invalid)
    if (error.response?.status === 401 && error.response?.data?.sessionInvalid) {
      // Clear session and redirect to login
      localStorage.removeItem("userSession");
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/login" && window.location.pathname !== "/admin-login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

// Export default axios (now configured with interceptors)
export default axios;

