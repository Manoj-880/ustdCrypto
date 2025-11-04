import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Space, 
  Pagination,
  Spin,
  Empty,
  Avatar
} from 'antd';
import { 
  UserOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getUserReferrals } from '../../api_calls/referralsApi';
import dayjs from 'dayjs';
import '../../styles/pages/userPages/referrals.css';

const { Title, Text } = Typography;

const Referrals = () => {
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      loadReferrals();
    }
  }, [user]);

  const loadReferrals = async () => {
    setLoading(true);
    try {
      const response = await getUserReferrals(user._id);
      if (response.success) {
        setReferrals(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data?.length || 0
        }));
      } else {
        setReferrals([]);
        setPagination(prev => ({
          ...prev,
          total: 0
        }));
      }
    } catch (error) {
      console.error('Error loading referrals:', error);
      setReferrals([]);
      setPagination(prev => ({
        ...prev,
        total: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Text>{email}</Text>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: (date) => (
        <div className="date-cell">
          <div className="date">{dayjs(date).format('MMM DD, YYYY')}</div>
          <div className="time">{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.joinedDate).unix() - dayjs(b.joinedDate).unix(),
    },
  ];

  const paginatedData = referrals.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div className="referrals-page">
      <div className="referrals-header">
        <Title level={2} className="page-title">
          My Referrals
        </Title>
        <Text className="page-subtitle">
          View all users who registered using your referral code
        </Text>
      </div>

      <Card className="referrals-card">
        <div className="card-header">
          <Title level={4} className="card-title">
            Your Referrals
          </Title>
          <Text className="card-subtitle">
            {referrals.length} total referral{referrals.length !== 1 ? 's' : ''}
          </Text>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text className="loading-text">Loading referrals...</Text>
            </div>
          ) : referrals.length === 0 ? (
            <Empty
              description="No referrals found. Share your referral code to invite friends!"
              className="empty-state"
            />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey="_id"
                pagination={false}
                tableLayout="fixed"
                style={{ width: '100%' }}
                className="referrals-table"
                size="middle"
              />
              <div className="pagination-container">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePaginationChange}
                  onShowSizeChange={handlePaginationChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} referral${total !== 1 ? 's' : ''}`
                  }
                  className="referrals-pagination"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Referrals;

