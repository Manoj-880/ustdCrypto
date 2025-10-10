import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Button,
  Space,
} from "antd";
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
import { adminDashboard } from "../../api_calls/dashboard";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    let response = await adminDashboard();
    if (response.success) {
      setDashboardData(response.data);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const recentTransactions = dashboardData.recentTransactions;

  const recentUsers = dashboardData.recentUsers;

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <Text copyable={{ text }} className="transaction-id">
          {text}
        </Text>
      ),
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
      render: (amount) => amount ? `${parseFloat(amount).toFixed(2)} USDT` : '0.00 USDT',
    },
  ];

  const userColumns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
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
              <div className="stat-value">{dashboardData.usersCount}</div>
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
              <div className="stat-value">
                {dashboardData.adminBalance} USDT
              </div>
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
              <div className="stat-value">{dashboardData.totalRequests}</div>
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
              <div className="stat-value">
                {dashboardData.totalTransactions}
              </div>
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
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </Button>
              <Button
                icon={<SwapOutlined />}
                onClick={() => navigate("/admin/transactions")}
              >
                View Transactions
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={() => navigate("/admin/withdraw-requests")}
              >
                Process Withdrawals
              </Button>
              <Button
                icon={<WalletOutlined />}
                onClick={() => navigate("/admin/wallets")}
              >
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
              <Button
                type="link"
                onClick={() => navigate("/admin/transactions")}
                className="view-all-btn"
              >
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
              <Button
                type="link"
                onClick={() => navigate("/admin/users")}
                className="view-all-btn"
              >
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
