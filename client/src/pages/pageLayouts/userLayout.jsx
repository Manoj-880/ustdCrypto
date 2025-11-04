// UserLayout.jsx
import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  SwapOutlined,
  RiseOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  SendOutlined,
  FileTextOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import ScrollToTop from "../../components/ScrollToTop";
import useIdleTimeout from "../../hooks/useIdleTimeout";
import useSessionValidation from "../../hooks/useSessionValidation";
import LockinMaturityModal from "../../components/LockinMaturityModal";
import { getCompletedLockins } from "../../api_calls/lockinApi";
import UserDashboard from "../userPages/userDashboard";
import Transactions from "../userPages/transactions";
import Profits from "../userPages/profits";
import FAQ from "../userPages/faq";
import Profile from "../userPages/profile";
import Lockins from "../userPages/lockins";
import WithdrawalRequests from "../userPages/withdrawalRequests";
import Referrals from "../userPages/referrals";
import Terms from "../userPages/terms";
import PrivacyPolicy from "../userPages/privacyPolicy";
import RiskDisclaimer from "../static/riskDisclaimer";
import logo from "../../assets/short_logo.png";
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
  const [showMaturityModal, setShowMaturityModal] = useState(false);
  const [currentMatureLockin, setCurrentMatureLockin] = useState(null);
  const [matureLockins, setMatureLockins] = useState([]);

  // Helper function to strip HTML tags and clean text
  const stripHtmlTags = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, "").trim();
  };

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = (isIdleLogout = false) => {
    logout();
    if (isIdleLogout) {
      toast.warning("You have been logged out due to inactivity.", { position: "top-right" });
    } else {
      toast.success("Logged out successfully!", { position: "top-right" });
    }
    navigate("/login");
  };

  // Handle idle timeout - logout after 10 minutes of inactivity
  useIdleTimeout(
    10 * 60 * 1000, // 10 minutes in milliseconds
    () => handleLogout(true),
    !!user // Only enable when user is logged in
  );

  // Handle session validation - check if logged out from another device
  useSessionValidation(
    () => {
      logout();
      toast.warning("You have been logged out. Another device has logged in with your account.", { position: "top-right" });
      navigate("/login");
    },
    !!user, // Only enable when user is logged in
    30000 // Check every 30 seconds
  );

  // Check for completed lock-ins on mount and when user changes
  useEffect(() => {
    const checkMatureLockins = async () => {
      if (!user || !user._id) return;

      try {
        const response = await getCompletedLockins(user._id);
        if (response.success && response.data && response.data.length > 0) {
          setMatureLockins(response.data);
          // Show modal for first completed lock-in
          setCurrentMatureLockin(response.data[0]);
          setShowMaturityModal(true);
        }
      } catch (error) {
        console.error('Error checking for mature lock-ins:', error);
      }
    };

    if (user) {
      // Delay check to allow page to load
      const timer = setTimeout(() => {
        checkMatureLockins();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleMaturityModalClose = () => {
    setShowMaturityModal(false);
    // If there are more mature lock-ins, show the next one
    if (matureLockins.length > 1) {
      const currentIndex = matureLockins.findIndex(l => l._id === currentMatureLockin?._id);
      const nextIndex = currentIndex + 1;
      if (nextIndex < matureLockins.length) {
        setCurrentMatureLockin(matureLockins[nextIndex]);
        setShowMaturityModal(true);
      } else {
        setCurrentMatureLockin(null);
        setMatureLockins([]);
      }
    } else {
      setCurrentMatureLockin(null);
      setMatureLockins([]);
    }
  };

  const handleMaturitySuccess = () => {
    // Remove processed lock-in from list
    setMatureLockins(prev => prev.filter(l => l._id !== currentMatureLockin?._id));
    handleMaturityModalClose();
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <PieChartOutlined />,
      path: "/app",
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: <SwapOutlined />,
      path: "/app/transaction",
    },
    {
      key: "profits",
      label: "Profits",
      icon: <RiseOutlined />,
      path: "/app/profit",
    },
    {
      key: "lockins",
      label: "Lock-Ins",
      icon: <LockOutlined />,
      path: "/app/lockins",
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      icon: <SendOutlined />,
      path: "/app/withdrawals",
    },
    {
      key: "referrals",
      label: "My Referrals",
      icon: <TeamOutlined />,
      path: "/app/referrals",
    },
    {
      key: "faq",
      label: "FAQ",
      icon: <QuestionCircleOutlined />,
      path: "/app/faq",
    },
    {
      key: "terms",
      label: "Terms & Conditions",
      icon: <FileTextOutlined />,
      path: "/app/terms",
    },
    {
      key: "privacy-policy",
      label: "Privacy Policy",
      icon: <SafetyOutlined />,
      path: "/app/privacy-policy",
    },
    {
      key: "risk-disclaimer",
      label: "Risk Disclaimer",
      icon: <ExclamationCircleOutlined />,
      path: "/app/risk-disclaimer",
    },
  ];

  return (
    <div
      className={`layout ${collapsed ? "collapsed" : ""} ${
        isMobile ? "mobile" : ""
      }`}
    >
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div className="mobile-backdrop" onClick={() => setCollapsed(true)} />
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="avatar">
            {stripHtmlTags(user?.firstName)?.charAt(0)?.toUpperCase() ||
              stripHtmlTags(user?.name)?.charAt(0)?.toUpperCase() ||
              "U"}
          </div>
          {!collapsed && !isMobile && (
            <div className="profile-info">
              <h4 className="user-name">
                {user?.firstName && user?.lastName
                  ? `${stripHtmlTags(user.firstName)}`
                  : stripHtmlTags(user?.name) || "User"}
              </h4>
              <p className="user-email">{user?.email || "user@example.com"}</p>
              <button
                className="view-profile"
                onClick={() => navigate("/app/profile")}
              >
                View Profile
              </button>
            </div>
          )}
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {!collapsed && !isMobile && item.label}
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
              <img src={logo} alt="Secure USDT Logo" className="header-logo" />
              <h2 className="platform-name">Secure USDT</h2>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutOutlined />
            {!isMobile && "Logout"}
          </button>
        </header>

        <div className="content">
          {/* Nested Routes Rendering */}
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transaction" element={<Transactions />} />
            <Route path="/profit" element={<Profits />} />
            <Route path="/lockins" element={<Lockins />} />
            <Route path="/withdrawals" element={<WithdrawalRequests />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />
          </Routes>
        </div>
      </div>
      <ScrollToTop />
      
      {/* Lock-in Maturity Modal */}
      <LockinMaturityModal
        visible={showMaturityModal}
        lockin={currentMatureLockin}
        onClose={handleMaturityModalClose}
        onSuccess={handleMaturitySuccess}
      />
    </div>
  );
};

export default UserLayout;
