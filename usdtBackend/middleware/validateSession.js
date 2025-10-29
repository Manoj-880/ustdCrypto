/**
 * Session Validation Middleware
 * 
 * This middleware validates user sessions by checking if the sessionId
 * in the request headers matches the user's currentSessionId in the database.
 * 
 * If the session is invalid (user logged in from another device), it returns 401.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const userRepo = require("../repos/userRepo");

const validateSession = async (req, res, next) => {
  try {
    // Get sessionId and userId from request headers
    const sessionId = req.headers['x-session-id'];
    const userId = req.headers['x-user-id'] || req.body?.userId || req.query?.userId;

    // If no sessionId provided, continue (let other middleware handle auth)
    if (!sessionId) {
      return next();
    }

    // If sessionId is provided, validate it
    if (userId) {
      const user = await userRepo.getUserById(userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
          sessionInvalid: true
        });
      }

      // Check if sessionId matches user's currentSessionId
      if (user.currentSessionId !== sessionId) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
          sessionInvalid: true
        });
      }

      // Attach user to request for use in controllers
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      sessionInvalid: true
    });
  }
};

module.exports = validateSession;

