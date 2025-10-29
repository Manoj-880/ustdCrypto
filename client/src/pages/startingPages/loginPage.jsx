/**
 * User Login Page - USDT Investment Platform
 * 
 * This page handles user authentication for the investment platform.
 * It provides a secure login interface with email verification support,
 * password management, and automatic redirection based on authentication status.
 * 
 * Key Features:
 * - Email and password authentication
 * - Email verification status checking
 * - Resend verification email functionality
 * - Automatic redirection after login
 * - Form validation and error handling
 * - Responsive design with modern UI
 * 
 * Authentication Flow:
 * 1. User enters email and password
 * 2. System validates credentials
 * 3. Checks email verification status
 * 4. Redirects to appropriate dashboard
 * 5. Handles verification prompts if needed
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect } from "react";
import { Input, Button, Modal, Typography, Space, Divider, Alert } from "antd";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.svg";
import "../../styles/pages/startingPages/loginPage.css";
import { userLogin } from "../../api_calls/loginApi";
import { resendVerificationEmail } from "../../api_calls/emailVerificationApi";

const { Title, Text, Link, Paragraph } = Typography;

/**
 * Login Page Component
 * 
 * This component provides the main login interface for users to access
 * their investment accounts. It handles authentication, email verification,
 * and provides a seamless user experience with proper error handling.
 * 
 * State Management:
 * - formData: User's email and password input
 * - isLoading: Loading state during authentication
 * - verificationModalVisible: Controls verification modal display
 * - verificationEmail: Email address for verification resend
 * - resendLoading: Loading state for verification resend
 * 
 * @returns {JSX.Element} Login page interface
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  /**
   * Handle Form Input Changes
   * 
   * Updates the form data state when users type in the input fields.
   * Uses the input's id attribute to determine which field to update.
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  /**
   * Handle Authentication Redirect
   * 
   * This effect automatically redirects authenticated users to their
   * appropriate dashboard. It checks authentication status and
   * redirects to the intended destination or default app route.
   */
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/app";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  /**
   * Handle Login Form Submission
   * 
   * Processes the user's login credentials and handles the authentication flow.
   * It validates input, sends login request, handles email verification status,
   * and manages user session upon successful authentication.
   * 
   * Process Flow:
   * 1. Validate form input completeness
   * 2. Send login request to backend
   * 3. Check authentication response
   * 4. Handle email verification requirements
   * 5. Update user session and redirect
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields!", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      let response = await userLogin(formData);
      if (response.success) {
        toast.success("Login successful!", { position: "top-right" });
        login(response.data, "user");
      } else {
        if (response.message === "Email not verified") {
          setVerificationEmail(formData.email);
          setVerificationModalVisible(true);
        } else {
          toast.error(response.message || "Login failed", { position: "top-right" });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Verification Email Resend
   * 
   * Sends a new verification email to the user's email address.
   * This is used when users need to verify their email before
   * accessing their accounts.
   * 
   * Process Flow:
   * 1. Validate email address
   * 2. Send resend request to backend
   * 3. Provide user feedback
   * 4. Close modal on success
   */
  const handleResendVerification = async () => {
    if (!verificationEmail) {
      toast.error("Email address is required");
      return;
    }

    setResendLoading(true);
    try {
      const response = await resendVerificationEmail({ email: verificationEmail });
      if (response.success) {
        toast.success("Verification email sent successfully!", { position: "top-right" });
        setVerificationModalVisible(false);
        setVerificationEmail("");
      } else {
        toast.error(response.message || "Failed to send verification email", { position: "top-right" });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Failed to resend verification email", { position: "top-right" });
    } finally {
      setResendLoading(false);
    }
  };

  /**
   * Close Verification Modal
   * 
   * Closes the email verification modal and resets related state.
   * This provides a clean state when the modal is dismissed.
   */
  const handleCloseVerificationModal = () => {
    setVerificationModalVisible(false);
    setVerificationEmail("");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <img src={logo} alt="USDT Investment Platform" className="logo" />
            <Title level={2} className="login-title">
              Welcome Back
            </Title>
            <Paragraph className="login-subtitle">
              Sign in to your investment account
            </Paragraph>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div className="input-group">
                <Text strong>Email Address</Text>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  prefix={<UserOutlined />}
                  size="large"
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <Text strong>Password</Text>
                <Input.Password
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  prefix={<LockOutlined />}
                  size="large"
                  className="login-input"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                className="login-button"
                block
              >
                {isLoading ? "Signing In..." : "Sign In"}
                <ArrowRightOutlined />
              </Button>
            </Space>
          </form>

          <Divider className="login-divider">
            <Text type="secondary">Don't have an account?</Text>
          </Divider>

          <div className="login-footer">
            <Link href="/register" className="register-link">
              <MailOutlined /> Create New Account
            </Link>
          </div>
        </div>
      </div>

      <Modal
        title="Email Verification Required"
        open={verificationModalVisible}
        onCancel={handleCloseVerificationModal}
        footer={null}
        className="verification-modal"
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            message="Email Not Verified"
            description="Please verify your email address before signing in. Check your inbox for the verification email."
            type="warning"
            showIcon
          />
          
          <div>
            <Text strong>Email Address:</Text>
            <Input
              value={verificationEmail}
              onChange={(e) => setVerificationEmail(e.target.value)}
              placeholder="Enter your email address"
              size="large"
              className="verification-input"
            />
          </div>

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseVerificationModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={resendLoading}
              onClick={handleResendVerification}
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </Space>
        </Space>
      </Modal>
    </div>
  );
};

export default LoginPage;