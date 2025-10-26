import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Space, Divider, Checkbox } from "antd";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  WalletOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  ArrowRightOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.svg";
import "../../styles/pages/startingPages/register.css";
import { createUser } from "../../api_calls/userApi";

const { Title, Text, Link } = Typography;

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        walletId: "",
        referralCode: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/app", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreeToTerms) {
            toast.error("Please agree to the terms and conditions!", { position: "top-right" });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!", { position: "top-right" });
            return;
        }

        setIsLoading(true);

        let response = await createUser(formData);
        if(response.success) {
            toast.success("Registration successful! Please check your email to verify your account.", { position: "top-right" });
            // Don't auto-login, user needs to verify email first
            navigate("/login", { replace: true });
        } else {
            toast.error(response.message, { position: "top-right" });
        }

        setIsLoading(false);
    };

    return (
        <div className="register-page">
            {/* Background Elements */}
            <div className="register-background">
                <div className="bg-shape bg-shape-1"></div>
                <div className="bg-shape bg-shape-2"></div>
                <div className="bg-shape bg-shape-3"></div>
            </div>

            {/* Main Register Container */}
            <div className="register-container">
                       {/* Logo and Brand Section */}
                       <div className="register-header">
                           <div className="register-logo">
                               <img src={logo} alt="SecureUSDT Logo" className="logo-image" />
                               <div className="logo-glow"></div>
                           </div>
                           <Title level={1} className="register-title">
                               SecureUSDT
                           </Title>
                           <Text className="register-subtitle">
                               Create your account to start investing
                           </Text>
                       </div>

                {/* Register Form */}
                <div className="register-form-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <Input
                                    id="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="form-input"
                                    size="large"
                                    prefix={<UserOutlined className="input-icon" />}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    id="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="form-input"
                                    size="large"
                                    prefix={<UserOutlined className="input-icon" />}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
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
                                <Input
                                    id="mobile"
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="form-input"
                                    size="large"
                                    prefix={<PhoneOutlined className="input-icon" />}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <Input
                                id="walletId"
                                placeholder="Wallet ID"
                                value={formData.walletId}
                                onChange={handleChange}
                                className="form-input"
                                size="large"
                                prefix={<WalletOutlined className="input-icon" />}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                id="referralCode"
                                placeholder="Referral code (optional)"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="form-input"
                                size="large"
                                prefix={<CheckCircleOutlined className="input-icon" />}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <Input.Password
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    size="large"
                                    prefix={<LockOutlined className="input-icon" />}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <Input.Password
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    size="large"
                                    prefix={<LockOutlined className="input-icon" />}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="terms-section">
                            <Checkbox 
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="terms-checkbox"
                            >
                                <Text className="terms-text">
                                    I agree to the{" "}
                                    <Link 
                                        href="/terms" 
                                        className="terms-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/terms');
                                        }}
                                    >
                                        Terms of Service
                                    </Link>
                                    {", "}
                                    <Link 
                                        href="/privacy-policy" 
                                        className="terms-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/privacy-policy');
                                        }}
                                    >
                                        Privacy Policy
                                    </Link>
                                    {" and "}
                                    <Link 
                                        href="/risk-disclaimer" 
                                        className="terms-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/risk-disclaimer');
                                        }}
                                    >
                                        Risk Disclaimer
                                    </Link>
                                </Text>
                            </Checkbox>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="register-button"
                            size="large"
                            block
                            loading={isLoading}
                            icon={<ArrowRightOutlined />}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <Divider className="register-divider">
                        <Text className="divider-text">or</Text>
                    </Divider>

                    <div className="register-footer">
                        <Text className="footer-text">
                            Already have an account?{" "}
                            <Link href="/login" className="login-link">
                                Sign In
                            </Link>
                        </Text>
                    </div>
                </div>

                {/* Features Section */}
                <div className="register-features">
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
        </div>
    );
};

export default Register;