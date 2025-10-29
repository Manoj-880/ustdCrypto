const userRepo = require("../repos/userRepo");
const adminRepo = require("../repos/adminRepo");
const crypto = require("crypto");

/**
 * Generate a unique session ID
 * @returns {string} Unique session identifier
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userRepo.getUserByMail(email);
    
    if (user && user.password === password) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(200).send({
          success: false,
          message: "Please verify your email address before logging in. Check your inbox for the verification link.",
          requiresVerification: true,
          email: user.email
        });
      }
      
      // Generate new session ID
      const newSessionId = generateSessionId();
      
      // If user has an existing session, it will be invalidated
      // (the old sessionId will no longer match currentSessionId)
      // Update user with new session
      await userRepo.updateUserSession(user._id, newSessionId);
      
      // Fetch updated user data to verify session was saved
      const updatedUser = await userRepo.getUserById(user._id);
      
      // Verify session was saved correctly
      if (updatedUser.currentSessionId !== newSessionId) {
        console.error("⚠️ Session ID mismatch after update:", {
          expected: newSessionId,
          actual: updatedUser.currentSessionId
        });
        // Still send response but log the error
      }
      
      console.log("✅ Login successful:", {
        userId: user._id,
        email: user.email,
        sessionId: newSessionId
      });
      
      res.status(200).send({
        success: true,
        message: "Login Successful",
        data: updatedUser,
        sessionId: newSessionId, // Send sessionId to frontend
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const AdminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let admin = await adminRepo.getAdminByEmail(email);
    if (admin && admin.password === password) {
      res.status(200).send({
        success: true,
        message: "Login Successful",
        data: admin,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Check Session Status
 * Validates if a session is still active by checking if sessionId matches user's currentSessionId
 */
const checkSessionStatus = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      console.warn("⚠️ [Session Check] Missing sessionId or userId:", { sessionId, userId });
      return res.status(400).send({
        success: false,
        message: "SessionId and userId are required",
      });
    }

    const user = await userRepo.getUserById(userId);

    if (!user) {
      console.warn("⚠️ [Session Check] User not found:", userId);
      return res.status(404).send({
        success: false,
        message: "User not found",
        isValid: false,
      });
    }

    // Check if sessionId matches user's currentSessionId
    const isValid = user.currentSessionId === sessionId;
    
    console.log("🔍 [Session Check]:", {
      userId,
      providedSessionId: sessionId.substring(0, 10) + "...",
      dbSessionId: user.currentSessionId ? user.currentSessionId.substring(0, 10) + "..." : null,
      isValid
    });

    res.status(200).send({
      success: true,
      isValid: isValid,
      message: isValid ? "Session is valid" : "Session has been invalidated",
    });
  } catch (error) {
    console.error("❌ [Session Check] Error:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  AdminLogin,
  checkSessionStatus,
};
