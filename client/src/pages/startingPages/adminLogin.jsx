import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Space, Divider } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, ArrowRightOutlined, CrownOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.svg";
import "../../styles/pages/startingPages/adminLogin.css";

const { Title, Text, Link } = Typography;

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin", { replace: true });
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
            // Create admin data for session storage
            const adminData = {
                id: Date.now().toString(),
                email: formData.email,
                name: formData.email.split('@')[0], // Extract name from email
                loginTime: new Date().toISOString(),
                role: 'admin'
            };
            
            // Store admin data in session storage
            login(adminData);
            
            toast.success("Admin login successful!", { position: "top-right" });
            setFormData({ email: "", password: "" });
            setIsLoading(false);
            
            // Redirect to admin dashboard
            navigate("/admin", { replace: true });
        }, 1500);
    };

    return (
        <div className="admin-login-page">
            {/* Background Elements */}
            <div className="admin-login-background">
                <div className="bg-shape bg-shape-1"></div>
                <div className="bg-shape bg-shape-2"></div>
                <div className="bg-shape bg-shape-3"></div>
            </div>

            {/* Main Admin Login Container */}
            <div className="admin-login-container">
                {/* Logo and Brand Section */}
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <img src={logo} alt="Alpha Wave Logo" className="logo-image" />
                        <div className="logo-glow"></div>
                        <div className="admin-crown">
                            <CrownOutlined />
                        </div>
                    </div>
                    <Title level={1} className="admin-login-title">
                        Admin Portal
                    </Title>
                    <Text className="admin-login-subtitle">
                        Manage users, monitor transactions, and control system settings
                    </Text>
                </div>

                {/* Admin Login Form */}
                <div className="admin-login-form-container">
                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Admin Email Address"
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
                                placeholder="Admin Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                size="large"
                                prefix={<LockOutlined className="input-icon" />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                disabled={isLoading}
                            />
                        </div>

                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="admin-login-button"
                            size="large"
                            block
                            loading={isLoading}
                            icon={<ArrowRightOutlined />}
                        >
                            {isLoading ? "Signing In..." : "Sign In as Admin"}
                        </Button>
                    </form>

                    <Divider className="admin-login-divider">
                        <Text className="divider-text">or</Text>
                    </Divider>

                    <div className="admin-login-footer">
                        <Text className="footer-text">
                            Need user access?{" "}
                            <Link href="/login" className="user-login-link">
                                Switch to User Login
                            </Link>
                        </Text>
                    </div>
                </div>

                {/* Admin Features Section */}
                <div className="admin-login-features">
                    <div className="feature-item">
                        <div className="feature-icon">👥</div>
                        <Text className="feature-text">User Management</Text>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📈</div>
                        <Text className="feature-text">Transaction Monitor</Text>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⚙️</div>
                        <Text className="feature-text">System Settings</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
