import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space } from "antd";
import {
  UserOutlined,
  SwapOutlined,
  DollarOutlined,
  WalletOutlined,
  RiseOutlined,
  EyeOutlined,
  MoneyCollectOutlined,
  MinusCircleOutlined,
  SendOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/adminPages/adminDashboard.css";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const recentTransactions = [
    {
      key: "1",
      id: "TXN001",
      user: "john.doe@example.com",
      amount: 1000.0,
    },
    {
      key: "2",
      id: "TXN002",
      user: "jane.smith@example.com",
      amount: 500.0,
    },
    {
      key: "3",
      id: "TXN003",
      user: "bob.wilson@example.com",
      amount: 2500.0,
    },
  ];

  const recentUsers = [
    {
      key: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      joinDate: "2024-01-10",
    },
    {
      key: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: "2024-01-12",
    },
    {
      key: "3",
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      joinDate: "2024-01-14",
    },
  ];

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text copyable={{ text }} className="transaction-id">{text}</Text>,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toFixed(2)} USDT`,
    },
  ];

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <Title level={2} className="dashboard-title">
          Admin Dashboard
        </Title>
        <Text type="secondary" className="dashboard-subtitle">
          Overview of system statistics and recent activity
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-cards">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <UserOutlined />
              </div>
              <div className="stat-value">1,250</div>
              <div className="stat-title">Total Users</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <DollarOutlined />
              </div>
              <div className="stat-value">2,000.00 USDT</div>
              <div className="stat-title">Admin Wallet Balance</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <LogoutOutlined />
              </div>
              <div className="stat-value">23</div>
              <div className="stat-title">Withdrawal Requests</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">
                <SwapOutlined />
              </div>
              <div className="stat-value">15,420</div>
              <div className="stat-title">Total Transactions</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="quick-actions">
        <Col xs={24}>
          <Card title="Quick Actions" className="actions-card">
            <Space wrap>
              <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/admin/users')}>
                Manage Users
              </Button>
              <Button icon={<SwapOutlined />} onClick={() => navigate('/admin/transactions')}>
                View Transactions
              </Button>
              <Button icon={<LogoutOutlined />} onClick={() => navigate('/admin/withdraw-requests')}>
                Process Withdrawals
              </Button>
              <Button icon={<WalletOutlined />} onClick={() => navigate('/admin/wallets')}>
                Wallet Management
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]} className="activity-section">
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Transactions" 
            className="activity-card"
            extra={
              <Button type="link" onClick={() => navigate('/admin/transactions')} className="view-all-btn">
                View All
              </Button>
            }
          >
            <Table
              columns={transactionColumns}
              dataSource={recentTransactions}
              pagination={false}
              size="small"
              loading={loading}
              className="recent-table"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Users" 
            className="activity-card"
            extra={
              <Button type="link" onClick={() => navigate('/admin/users')} className="view-all-btn">
                View All
              </Button>
            }
          >
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              pagination={false}
              size="small"
              loading={loading}
              className="recent-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
