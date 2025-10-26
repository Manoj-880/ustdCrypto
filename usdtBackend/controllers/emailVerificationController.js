const crypto = require("crypto");
const userRepo = require("../repos/userRepo");
const userModel = require("../models/userModel");
const { sendEmail } = require("../services/emailService");

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Send verification email
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).send({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with verification token
    await userRepo.updateUser(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send verification email
    // const frontendUrl = 'http://localhost:5173';
    const frontendUrl = "https://secureusdt.com";
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const emailResult = await sendEmail(
      user.email,
      "emailVerification",
      "noreply@secureusdt.com",
      user.firstName,
      user.email,
      verificationLink
    );

    if (emailResult.success) {
      res.status(200).send({
        success: true,
        message: "Verification email sent successfully",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Send verification email error:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Verification request received with token:", token);

    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Verification token is required",
      });
    }

    // Find user by verification token
    console.log("Searching for user with token:", token);
    console.log("Token length:", token ? token.length : "undefined");
    const user = await userRepo.getUserByVerificationToken(token);
    console.log("User found by token:", user ? "Yes" : "No");
    if (user) {
      console.log("User email:", user.email);
      console.log("User token in DB:", user.emailVerificationToken);
      console.log("Token matches:", user.emailVerificationToken === token);
      console.log("Token expires at:", user.emailVerificationExpires);
      console.log("Current time:", new Date());
    } else {
      console.log(
        "No user found with this token. Checking all users with verification tokens..."
      );
      // Debug: Find all users with verification tokens
      const allUsersWithTokens = await userModel.find({
        emailVerificationToken: { $exists: true, $ne: null },
      });
      console.log("Users with verification tokens:", allUsersWithTokens.length);
      allUsersWithTokens.forEach((u) => {
        console.log(
          `User ${u.email}: token=${u.emailVerificationToken}, expires=${u.emailVerificationExpires}`
        );
      });
    }

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Check if token is expired
    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).send({
        success: false,
        message: "Verification token has expired",
      });
    }

    // Update user as verified
    await userRepo.updateUser(user._id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    // Send welcome email after successful verification
    try {
      const frontendUrl =
        process.env.FRONTEND_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://secureusdt.com"
          : "http://localhost:5173");
      const loginUrl = `${frontendUrl}/login`;

      const welcomeEmailResult = await sendEmail(
        user.email,
        "postVerificationWelcome",
        "admin@secureusdt.com",
        user.firstName,
        user.email,
        loginUrl
      );

      if (welcomeEmailResult.success) {
        console.log("Welcome email sent successfully to:", user.email);
      } else {
        console.warn(
          "Failed to send welcome email:",
          welcomeEmailResult.message
        );
      }
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the verification if email sending fails
    }

    res.status(200).send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).send({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new verification token
    await userRepo.updateUser(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send verification email
    const frontendUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://secureusdt.com"
        : "http://localhost:5173");
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const emailResult = await sendEmail(
      user.email,
      "emailVerification",
      "noreply@secureusdt.com",
      user.firstName,
      user.email,
      verificationLink
    );

    if (emailResult.success) {
      res.status(200).send({
        success: true,
        message: "Verification email resent successfully",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Failed to resend verification email",
      });
    }
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
};
