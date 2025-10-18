import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/logo.svg";
import "../../../styles/pages/adminPages/components/adminHeader.css";

const AdminHeader = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", { position: "top-right" });
    navigate("/admin-login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-brand">
        <button
          className="admin-menu-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <div className="admin-platform-brand">
          <img src={logo} alt="Secure USDT Logo" className="admin-header-logo" />
          <h2 className="admin-platform-name">Secure USDT Admin</h2>
        </div>
      </div>
      <button className="admin-logout-btn" onClick={handleLogout}>
        <LogoutOutlined />
        {!isMobile && <span>Logout</span>}
      </button>
    </header>
  );
};

export default AdminHeader;
