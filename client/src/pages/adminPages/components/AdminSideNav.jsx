import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  CrownOutlined,
  DashboardOutlined,
  UserOutlined,
  SwapOutlined,
  SendOutlined,
  WalletOutlined
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/pages/adminPages/components/adminSideNav.css";

const AdminSideNav = ({ collapsed, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined />, path: "/admin" },
    { key: "users", label: "Users", icon: <UserOutlined />, path: "/admin/users" },
    { key: "transactions", label: "Transactions", icon: <SwapOutlined />, path: "/admin/transactions" },
    { key: "withdraw-requests", label: "Withdrawals", icon: <SendOutlined />, path: "/admin/withdraw-requests" },
    { key: "wallets", label: "Admin Wallets", icon: <WalletOutlined />, path: "/admin/wallets" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-profile-card">
        <div className="admin-avatar">
          <CrownOutlined />
        </div>
        {!collapsed && (
          <div className="admin-profile-info">
            <h4>Admin</h4>
            {/* <p className="admin-email">{user?.email || 'admin@example.com'}</p> */}
            {/* <button className="view-profile">Admin Panel</button> */}
          </div>
        )}
      </div>

      <nav className="admin-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSideNav;
