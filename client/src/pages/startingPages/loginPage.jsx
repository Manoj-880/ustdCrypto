import React, { useState, useEffect } from "react";
import { Input, Button, Modal, Typography, Space, Divider } from "antd";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPassword from "./components/forgotPassword";
import logo from "../../assets/logo.svg";
import "../../styles/pages/startingPages/loginPage.css";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill all fields!", { position: "top-right" });
            return;
        }
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Create user data for session storage
            const userData = {
                id: Date.now().toString(),
                email: formData.email,
                name: formData.email.split('@')[0], // Extract name from email
                loginTime: new Date().toISOString(),
                role: 'user'
            };
            
            // Store user data in session storage
            login(userData);
            
            toast.success("Login successful!", { position: "top-right" });
            setFormData({ email: "", password: "" });
            setIsLoading(false);
            
            // Redirect to dashboard
            navigate("/", { replace: true });
        }, 1500);
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
                               <img src={logo} alt="Alpha Wave Logo" className="logo-image" />
                               <div className="logo-glow"></div>
                           </div>
                           <Title level={1} className="login-title">
                               Welcome to Alpha Wave
                           </Title>
                           <Text className="login-subtitle">
                               Sign in to your account to continue trading
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
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-options">
                            <Link 
                                className="forgot-link"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Forgot Password?
                            </Link>
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
                        <Text className="feature-text">Secure Trading</Text>
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

            {/* Forgot Password Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                width={400}
                className="forgot-password-modal"
            >
                <ForgotPassword onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default LoginPage;