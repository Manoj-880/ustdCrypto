import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Typography,
  Tag,
  Button,
  Modal,
  message,
  Tooltip,
  Card,
  Row,
  Col,
  Divider,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/pages/adminPages/adminWithdrawRequests.css";

const { Title, Text } = Typography;

const AdminWithdrawRequests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockRequests = [
        {
          key: "1",
          id: "WR001",
          userName: "John Doe",
          userEmail: "john.doe@example.com",
          usdtQuantity: 500.0,
          walletBalance: 2500.0,
          requestedAt: "2024-01-15 14:30:00",
        },
        {
          key: "2",
          id: "WR002",
          userName: "Jane Smith",
          userEmail: "jane.smith@example.com",
          usdtQuantity: 1000.0,
          walletBalance: 5000.0,
          requestedAt: "2024-01-15 13:45:00",
        },
        {
          key: "3",
          id: "WR003",
          userName: "Bob Wilson",
          userEmail: "bob.wilson@example.com",
          usdtQuantity: 250.0,
          walletBalance: 1250.0,
          requestedAt: "2024-01-14 16:20:00",
        },
        {
          key: "4",
          id: "WR004",
          userName: "Alice Johnson",
          userEmail: "alice.johnson@example.com",
          usdtQuantity: 750.0,
          walletBalance: 3750.0,
          requestedAt: "2024-01-13 11:15:00",
        },
        {
          key: "5",
          id: "WR005",
          userName: "Charlie Brown",
          userEmail: "charlie.brown@example.com",
          usdtQuantity: 2000.0,
          walletBalance: 10000.0,
          requestedAt: "2024-01-12 09:30:00",
        },
        {
          key: "6",
          id: "WR006",
          userName: "David Miller",
          userEmail: "david.miller@example.com",
          usdtQuantity: 150.0,
          walletBalance: 800.0,
          requestedAt: "2024-01-11 08:15:00",
        },
        {
          key: "7",
          id: "WR007",
          userName: "Sarah Wilson",
          userEmail: "sarah.wilson@example.com",
          usdtQuantity: 3000.0,
          walletBalance: 12000.0,
          requestedAt: "2024-01-10 16:45:00",
        },
        {
          key: "8",
          id: "WR008",
          userName: "Mike Johnson",
          userEmail: "mike.johnson@example.com",
          usdtQuantity: 120.0,
          walletBalance: 600.0,
          requestedAt: "2024-01-09 12:30:00",
        },
      ];
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter requests
  useEffect(() => {
    let filtered = [...requests];

    if (searchText) {
      filtered = filtered.filter(
        (req) =>
          req.id.toLowerCase().includes(searchText.toLowerCase()) ||
          req.userName.toLowerCase().includes(searchText.toLowerCase()) ||
          req.userEmail.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchText]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleApproveRequest = (requestId) => {
    Modal.confirm({
      title: "Approve Withdrawal Request",
      content: "Are you sure you want to approve this withdrawal request?",
      onOk: () => {
        message.success("Withdrawal request approved successfully!");
      },
    });
  };

  const handleRejectRequest = (requestId) => {
    Modal.confirm({
      title: "Reject Withdrawal Request",
      content: "Are you sure you want to reject this withdrawal request?",
      onOk: () => {
        message.success("Withdrawal request rejected successfully!");
      },
    });
  };

  const handleApproveAll = () => {
    Modal.confirm({
      title: "Approve All Requests",
      content: "Are you sure you want to approve all withdrawal requests?",
      onOk: () => {
        message.success("All withdrawal requests approved successfully!");
      },
    });
  };

  const handleRejectAll = () => {
    Modal.confirm({
      title: "Reject All Requests",
      content: "Are you sure you want to reject all withdrawal requests?",
      onOk: () => {
        message.success("All withdrawal requests rejected successfully!");
      },
    });
  };

  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount) + " USDT"
    );
  };


  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 180,
      render: (text, record) => (
        <div>
          <div className="user-name">{text}</div>
          <div className="user-email">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: "USDT Quantity",
      dataIndex: "usdtQuantity",
      key: "usdtQuantity",
      width: 140,
      render: (amount, record) => (
        <div className={`amount ${amount > record.walletBalance ? 'insufficient' : 'sufficient'}`}>
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a, b) => a.usdtQuantity - b.usdtQuantity,
    },
    {
      title: "Wallet Balance",
      dataIndex: "walletBalance",
      key: "walletBalance",
      width: 140,
      render: (balance) => (
        <div className="balance">
          {formatCurrency(balance)}
        </div>
      ),
      sorter: (a, b) => a.walletBalance - b.walletBalance,
    },
    {
      title: "Requested At",
      dataIndex: "requestedAt",
      key: "requestedAt",
      width: 150,
      render: (date) => (
        <div className="date-cell">
          <div className="date">{dayjs(date).format("MMM DD, YYYY")}</div>
          <div className="time">{dayjs(date).format("HH:mm")}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.requestedAt).unix() - dayjs(b.requestedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Approve Request">
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApproveRequest(record.id)}
              className="approve-btn"
            />
          </Tooltip>
          <Tooltip title="Reject Request">
            <Button
              type="text"
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleRejectRequest(record.id)}
              className="reject-btn"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const renderMobileCard = (request) => (
    <Card key={request.id} className="mobile-withdrawal-card" hoverable>
      <div className="mobile-card-header">
        <div className="user-avatar-section">
          <Avatar 
            size={48} 
            className="user-avatar"
            style={{ backgroundColor: request.usdtQuantity <= request.walletBalance ? '#52c41a' : '#f5222d' }}
          >
            {request.userName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="user-info">
            <Text strong className="user-name">{request.userName}</Text>
            <Text type="secondary" className="user-email">{request.userEmail}</Text>
          </div>
        </div>
        <div className="request-id">
          <Text className="request-id-text">{request.id}</Text>
        </div>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-content">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Amount</Text>
              <Text 
                strong 
                className={`stat-value amount-value ${request.usdtQuantity <= request.walletBalance ? 'sufficient' : 'insufficient'}`}
              >
                {request.usdtQuantity.toFixed(2)} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Wallet Balance</Text>
              <Text className="stat-value">{request.walletBalance.toFixed(2)} USDT</Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Requested At</Text>
              <Text className="stat-value">{dayjs(request.requestedAt).format("MMM DD, YYYY [at] HH:mm")}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Status</Text>
              <Text className={`stat-value ${request.usdtQuantity <= request.walletBalance ? 'sufficient' : 'insufficient'}`}>
                {request.usdtQuantity <= request.walletBalance ? 'Sufficient Balance' : 'Insufficient Balance'}
              </Text>
            </div>
          </Col>
        </Row>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-actions">
        <div className="action-buttons">
          <Tooltip title="Approve Request">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApproveRequest(request)}
              className="mobile-action-btn approve-btn"
              disabled={request.usdtQuantity > request.walletBalance}
            >
              Approve
            </Button>
          </Tooltip>
          <Tooltip title="Reject Request">
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleRejectRequest(request)}
              className="mobile-action-btn reject-btn"
            >
              Reject
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="admin-withdraw-requests">
      <div className="admin-withdraw-requests-header">
        <Title level={2} className="page-title">
          Withdrawals
        </Title>
        <Text type="secondary" className="page-subtitle">
          Review and process user withdrawal requests
        </Text>
      </div>

      {/* Search Bar and Action Buttons */}
      <div className="search-section">
        <div className="search-controls">
          <Input
            placeholder="Search by User Name or Email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <div className="action-buttons">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleApproveAll}
              className="approve-all-btn"
            >
              Approve All
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={handleRejectAll}
              className="reject-all-btn"
            >
              Reject All
            </Button>
          </div>
        </div>
      </div>

      {/* Requests Table/Cards */}
      <div className="table-section">
        {isMobile ? (
          <div className="mobile-cards-container">
            {filteredRequests.map(renderMobileCard)}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} requests`,
              className: "withdrawals-pagination",
            }}
            className="withdrawals-table"
            scroll={{ x: 1000 }}
          />
        )}
      </div>

      {/* Request Details Modal */}
      <Modal
        title="Withdrawal Request Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="request-modal"
      >
        {selectedRequest && (
          <div className="request-details">
            <div className="detail-row">
              <Text strong>Request ID:</Text>
              <Text copyable={{ text: selectedRequest.id }} className="request-id">
                {selectedRequest.id}
              </Text>
            </div>
            
            <div className="detail-row">
              <Text strong>User:</Text>
              <div>
                <Text className="user-name">{selectedRequest.userName}</Text>
                <br />
                <Text type="secondary" className="user-email">{selectedRequest.userEmail}</Text>
              </div>
            </div>

            <div className="detail-row">
              <Text strong>USDT Quantity:</Text>
              <Text className="amount">{formatCurrency(selectedRequest.usdtQuantity)}</Text>
            </div>

            <div className="detail-row">
              <Text strong>Wallet Balance:</Text>
              <Text className="balance">{formatCurrency(selectedRequest.walletBalance)}</Text>
            </div>



            <div className="detail-row">
              <Text strong>Requested At:</Text>
              <Text>{dayjs(selectedRequest.requestedAt).format("MMM DD, YYYY HH:mm")}</Text>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminWithdrawRequests;