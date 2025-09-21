// UserLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SwapOutlined,
  RiseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import UserDashboard from "../userPages/userDashboard";
import Transactions from "../userPages/transactions";
import Profits from "../userPages/profits";
import logo from "../../assets/logo.svg";
import "../../styles/layouts/userLayout.css";

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    // Check if mobile device
    const isMobile = window.innerWidth <= 768;
    return isMobile; // Mobile starts collapsed, desktop/tablet starts open
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile, auto-expand on desktop/tablet
      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", { position: "top-right" });
    navigate("/login");
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <PieChartOutlined />, path: "/" },
    { key: "transactions", label: "Transactions", icon: <SwapOutlined />, path: "/transaction" },
    { key: "profits", label: "Profits", icon: <RiseOutlined />, path: "/profit" },
  ];

  return (
    <div className={`layout ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          {(!collapsed && !isMobile) && (
            <div className="profile-info">
              <h4>{
            'User'}</h4>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
              <button className="view-profile">View Profile</button>
            </div>
          )}
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {(!collapsed && !isMobile) && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="main col-sm-12">
        <header className="header">
          <div className="header-brand">
            <button
              className="menu-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className="platform-brand">
              <img src={logo} alt="Alpha Wave Logo" className="header-logo" />
              <h2 className="platform-name">Alpha Wave</h2>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutOutlined />
            {!isMobile && <span>Logout</span>}
          </button>
        </header>

        <div className="content">
          {/* Nested Routes Rendering */}
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/transaction" element={<Transactions />} />
            <Route path="/profit" element={<Profits />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;