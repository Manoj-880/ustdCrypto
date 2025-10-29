/**
 * Session Utilities
 * 
 * Helper functions for managing user sessions in localStorage
 * while preserving sessionId for single-device login enforcement.
 */

/**
 * Preserve sessionId from existing session when updating
 * @param {Object} newSessionData - New session data to save
 * @returns {Object} Session data with preserved sessionId
 */
export const preserveSessionId = (newSessionData) => {
  try {
    const existingSession = localStorage.getItem("userSession");
    if (existingSession) {
      const parsed = JSON.parse(existingSession);
      // Preserve sessionId, role, and timestamp if not provided
      return {
        ...newSessionData,
        sessionId: newSessionData.sessionId || parsed.sessionId || null,
        role: newSessionData.role || parsed.role || "user",
        timestamp: newSessionData.timestamp || parsed.timestamp || new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Error preserving sessionId:", error);
  }
  
  // If no existing session, return as-is with defaults
  return {
    ...newSessionData,
    sessionId: newSessionData.sessionId || null,
    role: newSessionData.role || "user",
    timestamp: newSessionData.timestamp || new Date().toISOString(),
  };
};

/**
 * Safely update userSession in localStorage while preserving sessionId
 * @param {Object} sessionData - Session data to save (should include user)
 */
export const updateUserSession = (sessionData) => {
  try {
    const preservedData = preserveSessionId(sessionData);
    localStorage.setItem("userSession", JSON.stringify(preservedData));
    console.log("✅ [SessionUtils] Session updated with preserved sessionId:", 
      preservedData.sessionId ? preservedData.sessionId.substring(0, 10) + "..." : "null");
  } catch (error) {
    console.error("Error updating user session:", error);
  }
};

