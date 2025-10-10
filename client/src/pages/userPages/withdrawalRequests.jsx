import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Typography, 
  Space, 
  Button, 
  Modal, 
  message, 
  Tooltip,
  Pagination,
  Spin,
  Empty
} from 'antd';
import { 
  EyeOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getWithdrawalRequestsByUserId } from '../../api_calls/withdrawalApi';
import dayjs from 'dayjs';
import '../../styles/pages/userPages/withdrawalRequests.css';

const { Title, Text } = Typography;

const WithdrawalRequests = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      loadWithdrawalRequests();
    }
  }, [user]);

  const loadWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const response = await getWithdrawalRequestsByUserId(user._id);
      if (response.success) {
        setWithdrawalRequests(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length
        }));
      } else {
        message.error(response.message || 'Failed to load withdrawal requests');
      }
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
      message.error('Failed to load withdrawal requests');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'processing';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockCircleOutlined />;
      case 'APPROVED':
        return <CheckCircleOutlined />;
      case 'REJECTED':
        return <CloseCircleOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' USDT';
  };

  const showRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => (
        <Text code className="request-id">
          {id.slice(-8)}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        <Text strong className="amount">
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      width: 200,
      render: (address) => (
        <Text code className="wallet-address">
          {address}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
          className="status-tag"
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Approved', value: 'APPROVED' },
        { text: 'Rejected', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Requested At',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 150,
      render: (date) => (
        <div className="date-cell">
          <div className="date">{dayjs(date).format('MMM DD, YYYY')}</div>
          <div className="time">{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.requestDate).unix() - dayjs(b.requestDate).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showRequestDetails(record)}
            className="view-button"
          />
        </Tooltip>
      ),
    },
  ];

  const paginatedData = withdrawalRequests.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div className="withdrawal-requests-page">
      <div className="page-header">
        <Title level={2} className="page-title">
          Withdrawal Requests
        </Title>
        <Text className="page-subtitle">
          Track your withdrawal request status and history
        </Text>
      </div>

      <Card className="withdrawal-requests-card">
        <div className="card-header">
          <Title level={4} className="card-title">
            Your Withdrawal Requests
          </Title>
          <Text className="card-subtitle">
            {withdrawalRequests.length} total requests
          </Text>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text className="loading-text">Loading withdrawal requests...</Text>
            </div>
          ) : withdrawalRequests.length === 0 ? (
            <Empty
              description="No withdrawal requests found"
              className="empty-state"
            />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey="id"
                pagination={false}
                className="withdrawal-requests-table"
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
                    `${range[0]}-${range[1]} of ${total} requests`
                  }
                  className="withdrawal-requests-pagination"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Request Details Modal */}
      <Modal
        title="Withdrawal Request Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="request-details-modal"
      >
        {selectedRequest && (
          <div className="request-details">
            <div className="detail-section">
              <Title level={5} className="section-title">Request Information</Title>
              <div className="detail-row">
                <Text strong>Request ID:</Text>
                <Text code className="request-id">
                  {selectedRequest.id}
                </Text>
              </div>
              <div className="detail-row">
                <Text strong>Amount:</Text>
                <Text strong className="amount">
                  {formatCurrency(selectedRequest.amount)}
                </Text>
              </div>
              <div className="detail-row">
                <Text strong>Wallet Address:</Text>
                <Text code className="wallet-address">
                  {selectedRequest.walletAddress}
                </Text>
              </div>
              <div className="detail-row">
                <Text strong>Status:</Text>
                <Tag 
                  color={getStatusColor(selectedRequest.status)} 
                  icon={getStatusIcon(selectedRequest.status)}
                  className="status-tag"
                >
                  {selectedRequest.status}
                </Tag>
              </div>
            </div>

            <div className="detail-section">
              <Title level={5} className="section-title">Timeline</Title>
              <div className="detail-row">
                <Text strong>Requested At:</Text>
                <Text>
                  {dayjs(selectedRequest.requestDate).format('MMM DD, YYYY HH:mm')}
                </Text>
              </div>
              {selectedRequest.approvedAt && (
                <div className="detail-row">
                  <Text strong>Approved At:</Text>
                  <Text>
                    {dayjs(selectedRequest.approvedAt).format('MMM DD, YYYY HH:mm')}
                  </Text>
                </div>
              )}
              {selectedRequest.rejectedAt && (
                <div className="detail-row">
                  <Text strong>Rejected At:</Text>
                  <Text>
                    {dayjs(selectedRequest.rejectedAt).format('MMM DD, YYYY HH:mm')}
                  </Text>
                </div>
              )}
            </div>

            {selectedRequest.remarks && (
              <div className="detail-section">
                <Title level={5} className="section-title">Remarks</Title>
                <Text className="remarks-text">
                  {selectedRequest.remarks}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawalRequests;
