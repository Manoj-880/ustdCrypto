import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Space,
  Tag,
  Button,
  Empty,
  Spin,
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Pagination
} from 'antd';
import {
  LockOutlined,
  CalendarOutlined,
  DollarOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WalletOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { getLockinsByUserId, addLockinToWallet, relock, getAllLockinPlans } from '../../api_calls/lockinApi';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserSession } from '../../utils/sessionUtils';
import LockinMaturityModal from '../../components/LockinMaturityModal';
import '../../styles/pages/userPages/lockins.css';

const { Title, Text } = Typography;

const Lockins = () => {
  const [lockins, setLockins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalLockinBalance, setTotalLockinBalance] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user, login } = useAuth();
  const [showMaturityModal, setShowMaturityModal] = useState(false);
  const [selectedLockin, setSelectedLockin] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadLockins();
  }, []);

  const loadLockins = async (page = 1, pageSize = 10) => {
    if (!user || !user._id) {
      message.error('User not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      const response = await getLockinsByUserId(user._id);
      console.log('Lockins response:', response);
      if (response.success) {
        const allLockins = response.data;
        console.log('Lockins data:', allLockins);
        if (allLockins.length > 0) {
          console.log('First lockin details:', allLockins[0]);
        }
        setLockins(allLockins);
        
        // Update pagination total
        setPagination(prev => ({
          ...prev,
          total: allLockins.length,
          current: page,
          pageSize: pageSize,
        }));
        
        // Calculate total lock-in balance
        const total = allLockins.reduce((sum, lockin) => sum + parseFloat(lockin.amount), 0);
        setTotalLockinBalance(total);
      } else {
        message.error(response.message || 'Failed to load lock-ins');
      }
    } catch (error) {
      console.error('Error loading lock-ins:', error);
      message.error('Failed to load lock-ins');
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' USDT';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'blue';
      case 'PROCESSED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'PROCESSED':
        return 'Processed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Text 
          strong 
          style={{ 
            fontFamily: 'var(--font-family-mono)', 
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-semibold)'
          }}
        >
          {name || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Text strong style={{ color: '#52c41a' }}>
            {formatCurrency(amount)}
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
      {
        title: 'Duration',
        dataIndex: 'planDuration',
        key: 'duration',
        render: (planDuration) => (
          <Space>
            <CalendarOutlined style={{ color: '#1677ff' }} />
            <Text>{planDuration || 'N/A'} days</Text>
          </Space>
        ),
      },
      {
        title: 'Interest Rate',
        dataIndex: 'interestRate',
        key: 'interestRate',
        render: (interestRate) => (
          <Space>
            <PercentageOutlined style={{ color: '#722ed1' }} />
            <Text>{interestRate || 'N/A'}%</Text>
          </Space>
        ),
      },
    {
      title: 'Start Date',
      dataIndex: 'createdAt',
      key: 'startDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate) => endDate ? formatDate(endDate) : 'N/A',
    },
    {
      title: 'Days Remaining',
      dataIndex: 'endDate',
      key: 'daysRemaining',
      render: (endDate) => {
        if (!endDate) return 'N/A';
        const days = calculateDaysRemaining(endDate);
        return (
          <Space>
            <ClockCircleOutlined style={{ color: days > 0 ? '#52c41a' : '#f5222d' }} />
            <Text style={{ color: days > 0 ? '#52c41a' : '#f5222d' }}>
              {days} days
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Processed', value: 'PROCESSED' },
        { text: 'Cancelled', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => (record.status || '').toUpperCase() === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        // Only show actions for COMPLETED lock-ins that haven't been processed
        const status = (record.status || '').toUpperCase();
        if (status === 'COMPLETED' && !record.isProcessed) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<WalletOutlined />}
                onClick={() => handleAddToWallet(record)}
                loading={actionLoading[`wallet-${record._id}`]}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  border: 'none'
                }}
              >
                Add to Wallet
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => handleRelockClick(record)}
                loading={actionLoading[`relock-${record._id}`]}
                style={{
                  background: 'linear-gradient(135deg, #1677ff 0%, #40a9ff 100%)',
                  border: 'none'
                }}
              >
                Relock
              </Button>
            </Space>
          );
        }
        return <Text type="secondary">-</Text>;
      },
    },
  ];

  const handleAddToWallet = async (lockin) => {
    if (!lockin || !user) return;

    setActionLoading(prev => ({ ...prev, [`wallet-${lockin._id}`]: true }));
    try {
      const response = await addLockinToWallet(lockin._id, user._id);
      
      if (response.success) {
        message.success('Lock-in amount added to wallet successfully!');
        
        // Update user session with new balance
        if (response.data?.user) {
          updateUserSession({
            user: response.data.user,
          });
          login(response.data.user);
        }
        
        // Reload lock-ins to reflect updated status
        loadLockins();
      } else {
        message.error(response.message || 'Failed to add to wallet');
      }
    } catch (error) {
      console.error('Error adding to wallet:', error);
      message.error('Failed to add lock-in to wallet');
    } finally {
      setActionLoading(prev => ({ ...prev, [`wallet-${lockin._id}`]: false }));
    }
  };

  const handleRelockClick = (lockin) => {
    setSelectedLockin(lockin);
    setShowMaturityModal(true);
  };

  const handleMaturityModalClose = () => {
    setShowMaturityModal(false);
    setSelectedLockin(null);
  };

  const handleMaturitySuccess = () => {
    loadLockins(); // Reload to show updated status
    handleMaturityModalClose();
  };

  return (
    <div className="lockins-page">
      <div className="lockins-header">
        <Title level={2}>
          <LockOutlined /> My Lock-Ins
        </Title>
        <Text type="secondary">
          Manage your locked-in funds and track their performance
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} md={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Lock-Ins"
              value={lockins.length}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Locked Amount"
              value={totalLockinBalance}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="summary-card">
            <Statistic
              title="Active Lock-Ins"
              value={lockins.filter(lockin => (lockin.status || '').toUpperCase() === 'ACTIVE').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Lock-Ins Table */}
      <Card className="lockins-table-card">
        <div className="table-header">
          <Title level={4}>Lock-In History</Title>
          <Text type="secondary">
            {lockins.length} lock-in{lockins.length !== 1 ? 's' : ''} found
          </Text>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text>Loading lock-ins...</Text>
          </div>
        ) : lockins.length === 0 ? (
          <Empty
            description="No lock-ins found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={lockins.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
              )}
              rowKey="_id"
              pagination={false}
              className="lockins-table"
            />
            <div className="pagination-container">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={true}
                showQuickJumper={true}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} lock-ins`
                }
                onChange={handlePaginationChange}
                onShowSizeChange={handlePaginationChange}
                className="lockins-pagination"
              />
            </div>
          </>
        )}
      </Card>

      {/* Lock-in Maturity Modal for relock action */}
      <LockinMaturityModal
        visible={showMaturityModal}
        lockin={selectedLockin}
        onClose={handleMaturityModalClose}
        onSuccess={handleMaturitySuccess}
      />
    </div>
  );
};

export default Lockins;
