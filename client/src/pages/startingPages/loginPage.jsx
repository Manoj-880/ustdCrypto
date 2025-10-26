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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
   const { login, isAuthenticated } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/app";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields!", { position: "top-right" });
      return;
    }

    setIsLoading(true);

     let response = await userLogin(formData);
     console.log("Login response:", response);
     if (response.success) {
       toast.success("Login successful!", { position: "top-right" });
       console.log("Calling login with data:", response.data, "and role: user");
       login(response.data, "user");
       const from = location.state?.from?.pathname || "/app";
       navigate(from, { replace: true });
     } else if (response.requiresVerification) {
      setVerificationEmail(response.email);
      setVerificationModalVisible(true);
      toast.warning("Email verification required!", { position: "top-right" });
    } else {
      toast.error(response.message, { position: "top-right" });
    }
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const response = await resendVerificationEmail(verificationEmail);
      if (response.success) {
        toast.success("Verification email sent successfully!", {
          position: "top-right",
        });
        setVerificationModalVisible(false);
      } else {
        toast.error(response.message, { position: "top-right" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend verification email", {
        position: "top-right",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="login-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Main Login Container */}
      <div className="login-container">
        {/* Logo and Brand Section */}
        <div className="login-header">
          <div className="login-logo">
            <img src={logo} alt="Secure USDT Logo" className="logo-image" />
            <div className="logo-glow"></div>
          </div>
          <Title level={1} className="login-title">
            Welcome to Secure USDT
          </Title>
          <Text className="login-subtitle">
            Sign in to your account to continue investing
          </Text>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                size="large"
                prefix={<MailOutlined className="input-icon" />}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <Input.Password
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                size="large"
                prefix={<LockOutlined className="input-icon" />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                disabled={isLoading}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              size="large"
              block
              loading={isLoading}
              icon={<ArrowRightOutlined />}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <Divider className="login-divider">
            <Text className="divider-text">or</Text>
          </Divider>

           <div className="login-footer">
             <Text className="footer-text">
               Don't have an account?{" "}
               <Link href="/register" className="signup-link">
                 Create Account
               </Link>
             </Text>
           </div>
        </div>

        {/* Features Section */}
        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <Text className="feature-text">Secure Investments</Text>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <Text className="feature-text">Fast Execution</Text>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📈</div>
            <Text className="feature-text">Real-time Data</Text>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <MailOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
            Email Verification Required
          </div>
        }
        open={verificationModalVisible}
        onCancel={() => setVerificationModalVisible(false)}
        footer={null}
        centered
        width={500}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <Title level={4} style={{ color: "#1890ff" }}>
            Verify Your Email Address
          </Title>
          <Paragraph style={{ marginBottom: "24px" }}>
            Please check your email <strong>{verificationEmail}</strong> and
            click the verification link to activate your account.
          </Paragraph>

          <Alert
            message="Account Access Restricted"
            description="You must verify your email address before you can access your account."
            type="warning"
            showIcon
            style={{ marginBottom: "24px", textAlign: "left" }}
          />

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              size="large"
              loading={resendLoading}
              onClick={handleResendVerification}
              icon={<MailOutlined />}
              style={{ width: "100%" }}
            >
              Resend Verification Email
            </Button>
            <Button
              size="large"
              onClick={() => setVerificationModalVisible(false)}
              style={{ width: "100%" }}
            >
              Close
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
