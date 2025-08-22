import React, { useState } from "react";
import { Layout, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DashboardOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Dashboard from "./dashboard";
import Transactions from "./transaction";
import Profile from "./profile";

const { Header, Sider, Content } = Layout;

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const user = JSON.parse(localStorage.getItem("user")) || {
    firstName: "John",
    lastName: "Doe",
  };

  // ✅ map route path to menu key
  const getSelectedKey = () => {
    if (location.pathname === "/") return "1";
    if (location.pathname.startsWith("/transactions")) return "2";
    return "";
  };

  return (
    <Layout className="user-layout">
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed} className="sidenav">
        <div
          className="sidenav-header"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          <Avatar size={collapsed ? 40 : 64} icon={<UserOutlined />} />
          {!collapsed && <p className="username">{user.firstName}</p>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]} // ✅ dynamically selected
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<SwapOutlined />}>
            <Link to="/transactions">Transactions</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header className="header">
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggleCollapsed} className="trigger-icon" />
          ) : (
            <MenuFoldOutlined onClick={toggleCollapsed} className="trigger-icon" />
          )}
          <h2 className="app-title">USDT Trade</h2>
        </Header>

        <Content className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
