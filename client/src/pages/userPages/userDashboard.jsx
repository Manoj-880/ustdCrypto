import React, { useState, useEffect } from 'react';
import usdtIcon from '../../assets/usdt-icon.png';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Space, 
  Divider,
  Progress,
  Tag,
  Avatar,
  Button,
  Tooltip
} from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import AddFundsModal from '../../components/AddFundsModal';
import WithdrawModal from '../../components/WithdrawModal';
import '../../styles/pages/userPages/userDashboard.css';
import { 
  WalletOutlined, 
  DollarOutlined, 
  RiseOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    walletBalance: 0,
    monthlyProfit: 0,
    totalProfit: 0,
    monthlyGrowth: 0,
    totalGrowth: 0,
    profitPercentage: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setDashboardData({
        walletBalance: 15420.50,
        monthlyProfit: 2840.75,
        totalProfit: 45680.25,
        monthlyGrowth: 12.5,
        totalGrowth: 8.3,
        profitPercentage: 75
      });
      setLoading(false);
    }, 1000);
  }, []);



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' USDT';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? '#52c41a' : '#ff4d4f';
  };

  const handleAddFunds = () => {
    setShowAddFundsModal(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <Space direction="vertical" size="small">
          <Title level={2} className="dashboard-title">
            Welcome back to Alpha Wave!
          </Title>
          <Text type="secondary" className="dashboard-subtitle">
            Here's an overview of your financial performance
          </Text>
        </Space>
      </div>

      <Divider />

            {/* Wallet Balance Card */}
      <Card className="wallet-card" loading={loading}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16}>
            <Space direction="vertical" size="small">
              <Text type="secondary" className="card-label">
                Current Wallet Balance
              </Text>
              <Statistic
                title=""
                value={dashboardData.walletBalance}
                precision={2}
                valueStyle={{ 
                  color: '#1677ff', 
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
                formatter={(value) => formatCurrency(value)}
              />
            </Space>
          </Col>
          <Col xs={24} sm={8} className="wallet-icon-col">
            <div className="usdt-icon-wrapper">
              <img src={usdtIcon} alt="USDT" className="usdt-icon" />
            </div>
          </Col>
        </Row>
        
        {/* Wallet Action Buttons */}
        <div className="wallet-actions">
          <Space size="middle" wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddFunds}
              className="add-funds-btn"
            >
              Add Funds
            </Button>
            <Button
              size="large"
              icon={<MinusOutlined />}
              onClick={handleWithdraw}
              className="withdraw-btn"
            >
              Withdraw
            </Button>
          </Space>
        </div>
      </Card>

      <Divider />

      {/* Profit Cards */}
      <Row gutter={[24, 24]} className="profit-cards">
        <Col xs={24} lg={12}>
          <Card className="profit-card monthly-profit" loading={loading}>
            <div className="profit-card-header">
              <Space direction="vertical" size="small">
                <Text type="secondary" className="card-label">
                  Monthly Profit
                </Text>
                <Statistic
                  title=""
                  value={dashboardData.monthlyProfit}
                  precision={2}
                  valueStyle={{ 
                    color: '#52c41a', 
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
              </Space>
              <div className="growth-indicator">
                <Space>
                  {getGrowthIcon(dashboardData.monthlyGrowth)}
                  <Text 
                    style={{ color: getGrowthColor(dashboardData.monthlyGrowth) }}
                    className="growth-text"
                  >
                    {Math.abs(dashboardData.monthlyGrowth)}%
                  </Text>
                </Space>
                <Text type="secondary" className="growth-label">
                  vs last month
                </Text>
              </div>
            </div>
            <div className="profit-card-footer">
              <div className="daily-average">
                <Text type="secondary" className="daily-label">
                  Daily Average
                </Text>
                <Text className="daily-value">
                  {formatCurrency(dashboardData.monthlyProfit / 30)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="profit-card total-profit" loading={loading}>
            <div className="profit-card-header">
              <Space direction="vertical" size="small">
                <Text type="secondary" className="card-label">
                  Total Profit
                </Text>
                <Statistic
                  title=""
                  value={dashboardData.totalProfit}
                  precision={2}
                  valueStyle={{ 
                    color: '#722ed1', 
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
              </Space>
              <div className="growth-indicator">
                <Space>
                  {getGrowthIcon(dashboardData.totalGrowth)}
                  <Text 
                    style={{ color: getGrowthColor(dashboardData.totalGrowth) }}
                    className="growth-text"
                  >
                    {Math.abs(dashboardData.totalGrowth)}%
                  </Text>
                </Space>
                <Text type="secondary" className="growth-label">
                  vs last year
                </Text>
              </div>
            </div>
            <div className="profit-card-footer">
              <Tag color="purple" className="total-profit-tag">
                Lifetime Earnings
              </Tag>
              <Text type="secondary" className="total-profit-label">
                Accumulated over time
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="quick-stats">
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="stat-card">
            <Statistic
              title="Active Days"
              value={28}
              suffix="days"
              valueStyle={{ fontSize: '1.5rem' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="stat-card">
            <Statistic
              title="Success Rate"
              value={94.2}
              suffix="%"
              valueStyle={{ fontSize: '1.5rem', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="stat-card">
            <Statistic
              title="Total Transactions"
              value={156}
              valueStyle={{ fontSize: '1.5rem' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="stat-card">
            <Statistic
              title="Avg. Daily Profit"
              value={101.45}
              precision={2}
              suffix=" USDT"
              valueStyle={{ fontSize: '1.5rem' }}
            />
          </Card>
        </Col>
      </Row>

            {/* Add Funds Modal */}
            <AddFundsModal
              visible={showAddFundsModal}
              onClose={() => setShowAddFundsModal(false)}
              user={user}
            />

            {/* Withdraw Modal */}
            <WithdrawModal
              visible={showWithdrawModal}
              onClose={() => setShowWithdrawModal(false)}
              user={user}
            />
          </div>
        );
      };
      
      export default UserDashboard;