import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  message
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
  MinusOutlined,
  LockOutlined
} from '@ant-design/icons';
import { getAllLockinPlans, createLockin, getLockinsByUserId } from '../../api_calls/lockinApi';

const { Title, Text } = Typography;
const { Option } = Select;

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLockinModal, setShowLockinModal] = useState(false);
  const [lockinPlans, setLockinPlans] = useState([]);
  const [lockinLoading, setLockinLoading] = useState(false);
  const [form] = Form.useForm();
  const { user, login } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    walletBalance: 0,
    totalLockinBalance: 0,
    monthlyProfit: 0,
    totalProfit: 0,
    monthlyGrowth: 0,
    totalGrowth: 0,
    profitPercentage: 0
  });

  // Load dashboard data
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Update balance when user data changes
  useEffect(() => {
    if (user?.balance) {
      setDashboardData(prevData => ({
        ...prevData,
        walletBalance: parseFloat(user.balance)
      }));
    }
  }, [user?.balance]);

  const loadDashboardData = async () => {
    if (!user || !user._id) {
      console.error('User not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      // Use balance from user data in localStorage
      const walletBalance = user?.balance ? parseFloat(user.balance) : 0;
      
      // Load lock-in balance from backend
      const lockinResponse = await getLockinsByUserId(user._id);
      const lockinData = lockinResponse;
      
      // Calculate total lock-in balance
      const totalLockinBalance = lockinData.success 
        ? lockinData.data.reduce((sum, lockin) => sum + parseFloat(lockin.amount), 0)
        : 0;

      setDashboardData({
        walletBalance: walletBalance,
        totalLockinBalance: totalLockinBalance,
        monthlyProfit: 2840.75, // Mock data - replace with actual API
        totalProfit: 45680.25,  // Mock data - replace with actual API
        monthlyGrowth: 12.5,    // Mock data - replace with actual API
        totalGrowth: 8.3,       // Mock data - replace with actual API
        profitPercentage: 75    // Mock data - replace with actual API
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to user data from localStorage
      setDashboardData(prevData => ({
        ...prevData,
        walletBalance: user?.balance ? parseFloat(user.balance) : 0,
        totalLockinBalance: 0
      }));
    } finally {
      setLoading(false);
    }
  };



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

  const handleLockin = () => {
    setShowLockinModal(true);
    loadLockinPlans();
  };

  const loadLockinPlans = async () => {
    try {
      const response = await getAllLockinPlans();
      if (response.success) {
        setLockinPlans(response.data);
      } else {
        message.error(response.message || 'Failed to load lock-in plans');
      }
    } catch (error) {
      console.error('Error loading lock-in plans:', error);
      message.error('Failed to load lock-in plans');
    }
  };

  const handleLockinSubmit = async (values) => {
    setLockinLoading(true);
    console.log({
      userId: user._id,
        planId: values.planId,
        amount: parseFloat(values.amount)
    })
    try {
      const response = await createLockin({
        userId: user._id,
        planId: values.planId,
        amount: parseFloat(values.amount)
      });
      
      if (response.success) {
        // Update user data in localStorage with new balance
        if (response.data.user) {
          const updatedUser = response.data.user;
          const sessionData = {
            user: updatedUser,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          
          // Update the user context
          login(updatedUser);
        }
        
        message.success('Lock-in created successfully!');
        setShowLockinModal(false);
        form.resetFields();
        // Refresh dashboard data
        loadDashboardData();
      } else {
        message.error(response.message || 'Failed to create lock-in');
      }
    } catch (error) {
      console.error('Error creating lock-in:', error);
      message.error('Failed to create lock-in');
    } finally {
      setLockinLoading(false);
    }
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
            <Space direction="vertical" size="small">
              <Text type="secondary" className="card-label">
                Total Lock-In Balance
              </Text>
              <Statistic
                title=""
                value={dashboardData.totalLockinBalance}
                precision={2}
                valueStyle={{ 
                  color: '#52c41a', 
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
                formatter={(value) => formatCurrency(value)}
              />
            </Space>
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
            <Button
              size="large"
              icon={<LockOutlined />}
              onClick={handleLockin}
              className="lockin-btn"
            >
              Lock-In
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

            {/* Lock-In Modal */}
            <Modal
              className="lockin-modal"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LockOutlined style={{ color: '#1677ff' }} />
                  Lock-In Funds
                </div>
              }
              open={showLockinModal}
              onCancel={() => {
                setShowLockinModal(false);
                form.resetFields();
              }}
              footer={null}
              width={500}
              destroyOnClose
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleLockinSubmit}
                style={{ marginTop: '20px' }}
              >
                <Form.Item
                  name="amount"
                  label="USDT Amount"
                  rules={[
                    { required: true, message: 'Please enter the amount' },
                    { 
                      pattern: /^\d+(\.\d{1,2})?$/, 
                      message: 'Please enter a valid amount (e.g., 100.50)' 
                    },
                    { 
                      validator: (_, value) => {
                        if (value && parseFloat(value) <= 0) {
                          return Promise.reject('Amount must be greater than 0');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter USDT amount"
                    size="large"
                    prefix="$"
                    suffix="USDT"
                    className="form-input"
                  />
                </Form.Item>

                <Form.Item
                  name="planId"
                  label="Lock-In Duration"
                  rules={[{ required: true, message: 'Please select a lock-in duration' }]}
                >
                  <Select
                    placeholder="Select lock-in duration"
                    size="large"
                    loading={lockinPlans.length === 0}
                    className="form-select"
                  >
                    {lockinPlans.map((plan) => (
                      <Option key={plan._id} value={plan._id}>
                        {plan.duration} days - {plan.interestRate}% interest
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Space>
                    <Button
                      onClick={() => {
                        setShowLockinModal(false);
                        form.resetFields();
                      }}
                      size="large"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={lockinLoading}
                      icon={<LockOutlined />}
                    >
                      Lock-In Funds
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
      };
      
      export default UserDashboard;