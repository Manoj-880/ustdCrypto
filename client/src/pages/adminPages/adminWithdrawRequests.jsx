/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Typography,
  Button,
  Modal,
  message,
  Tooltip,
  Card,
  Row,
  Col,
  Divider,
  Avatar,
  Form,
  QRCode,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/pages/adminPages/adminWithdrawRequests.css";
import { 
  getAllRequests, 
  rejectWithdrawalRequest, 
  approveWithdrawalRequest, 
  verifyTransaction 
} from "../../api_calls/withdrawalRequestsApi";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const AdminWithdrawRequests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // New modal states
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [approveForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [verifyForm] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const response = await getAllRequests();
    if (response.success) {
      setRequests(response.data);
      setFilteredRequests(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.length
      }));
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleApproveRequest = (request) => {
    setCurrentRequest(request);
    setIsApproveModalVisible(true);
    approveForm.resetFields();
  };

  const handleRejectRequest = (request) => {
    setCurrentRequest(request);
    setIsRejectModalVisible(true);
    rejectForm.resetFields();
  };

  const handleVerifyRequest = (request) => {
    setCurrentRequest(request);
    setIsVerifyModalVisible(true);
    verifyForm.resetFields();
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleApproveSubmit = async (values) => {
    try {
      const response = await approveWithdrawalRequest(currentRequest.id, values.transactionId);
      if (response.success) {
        message.success("Withdrawal request approved successfully!");
        setIsApproveModalVisible(false);
        approveForm.resetFields();
        fetchRequests(); // Refresh the list
      } else {
        message.error(response.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      message.error("Failed to approve request");
    }
  };

  const handleRejectSubmit = async (values) => {
    try {
      const response = await rejectWithdrawalRequest(currentRequest.id, values.remarks);
      if (response.success) {
        message.success("Withdrawal request rejected successfully!");
        setIsRejectModalVisible(false);
        rejectForm.resetFields();
        fetchRequests(); // Refresh the list
      } else {
        message.error(response.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      message.error("Failed to reject request");
    }
  };

  const handleVerifySubmit = async (values) => {
    try {
      const response = await verifyTransaction(currentRequest.id, values.transactionId);
      if (response.success) {
        message.success("Transaction verified successfully!");
        setIsVerifyModalVisible(false);
        verifyForm.resetFields();
        fetchRequests(); // Refresh the list
      } else {
        message.error(response.message || "Failed to verify transaction");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      message.error("Failed to verify transaction");
    }
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
      width: 200,
      ellipsis: true,
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
      width: 120,
      align: 'right',
      render: (amount, record) => (
        <div
          className={`amount ${
            amount > record.walletBalance ? "insufficient" : "sufficient"
          }`}
        >
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a, b) => a.usdtQuantity - b.usdtQuantity,
    },
    {
      title: "Wallet Balance",
      dataIndex: "walletBalance",
      key: "walletBalance",
      width: 120,
      align: 'right',
      render: (balance) => (
        <div className="balance">{formatCurrency(balance)}</div>
      ),
      sorter: (a, b) => a.walletBalance - b.walletBalance,
    },
    {
      title: "Wallet Address",
      dataIndex: "walletAddress",
      key: "walletAddress",
      width: 200,
      ellipsis: true,
      render: (address) => (
        <div className="wallet-address" title={address}>
          {address}
        </div>
      ),
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
      sorter: (a, b) =>
        dayjs(a.requestedAt).unix() - dayjs(b.requestedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="View Details">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(record)}
                className="view-details-btn"
              />
            </Tooltip>
            {record.status === 'PENDING' && (
              <>
                <Tooltip title="Approve Request">
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApproveRequest(record)}
                    className="approve-btn"
                  />
                </Tooltip>
                <Tooltip title="Reject Request">
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleRejectRequest(record)}
                    className="reject-btn"
                  />
                </Tooltip>
              </>
            )}
            {record.status === 'APPROVED' && (
              <Tooltip title="Verify Transaction">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleVerifyRequest(record)}
                  className="verify-btn"
                />
              </Tooltip>
            )}
            {record.status === 'REJECTED' && (
              <Tooltip title={record.remarks || "Rejected"}>
                <Text type="secondary">Rejected</Text>
              </Tooltip>
            )}
            {record.status === 'COMPLETED' && (
              <Text type="success">Completed</Text>
            )}
          </Space>
        );
      },
    },
  ];

  // Mobile Card Component
  const renderMobileCard = (request) => (
    <Card className="mobile-withdrawal-card" hoverable>
      <div className="mobile-card-header">
        <div className="user-avatar-section">
          <Avatar
            size={48}
            className="user-avatar"
            style={{
              backgroundColor:
                request.usdtQuantity <= request.walletBalance
                  ? "#52c41a"
                  : "#f5222d",
            }}
          >
            {request.userName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="user-info">
            <Text strong className="user-name">
              {request.userName}
            </Text>
            <Text type="secondary" className="user-email">
              {request.userEmail}
            </Text>
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
              <Text type="secondary" className="stat-label">
                Amount
              </Text>
              <Text
                strong
                className={`stat-value amount-value ${
                  request.usdtQuantity <= request.walletBalance
                    ? "sufficient"
                    : "insufficient"
                }`}
              >
                {request.usdtQuantity ? parseFloat(request.usdtQuantity).toFixed(2) : '0.00'} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Wallet Balance
              </Text>
              <Text className="stat-value">
                {request.walletBalance ? parseFloat(request.walletBalance).toFixed(2) : '0.00'} USDT
              </Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Requested At
              </Text>
              <Text className="stat-value">
                {dayjs(request.requestedAt).format("MMM DD, YYYY [at] HH:mm")}
              </Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Status
              </Text>
              <Text
                className={`stat-value ${
                  request.usdtQuantity <= request.walletBalance
                    ? "sufficient"
                    : "insufficient"
                }`}
              >
                {request.usdtQuantity <= request.walletBalance
                  ? "Sufficient Balance"
                  : "Insufficient Balance"}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="mobile-divider" />

      <div className="mobile-card-actions">
        <div className="action-buttons">
          <Tooltip title="View Details">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(request)}
              className="mobile-action-btn view-details-btn"
            >
              Details
            </Button>
          </Tooltip>
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
        </div>
      </div>

      {/* Requests Table/Cards */}
      <div className="table-section">
        {isMobile ? (
          <div className="mobile-cards-container">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request.id}>
                  {renderMobileCard(request)}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <CloseCircleOutlined />
                  </div>
                  <Title level={3} className="empty-state-title">
                    No Withdrawal Requests
                  </Title>
                  <Text className="empty-state-description">
                    {searchText 
                      ? 'No withdrawal requests match your search criteria.' 
                      : 'No withdrawal requests have been submitted yet.'}
                  </Text>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredRequests.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
              )}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="withdrawals-table"
              scroll={{ x: 900 }}
              locale={{
                emptyText: (
                  <div className="table-empty-state">
                    <div className="empty-state-icon">
                      <CloseCircleOutlined />
                    </div>
                    <div className="empty-state-title">No Withdrawal Requests</div>
                    <div className="empty-state-description">
                      {searchText 
                        ? 'No withdrawal requests match your search criteria.' 
                        : 'No withdrawal requests have been submitted yet.'}
                    </div>
                  </div>
                )
              }}
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
                className="withdrawals-pagination"
              />
            </div>
          </>
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
              <Text
                copyable={{ text: selectedRequest.id }}
                className="request-id"
              >
                {selectedRequest.id}
              </Text>
            </div>

            <div className="detail-row">
              <Text strong>User:</Text>
              <div>
                <Text className="user-name">{selectedRequest.userName}</Text>
                <br />
                <Text type="secondary" className="user-email">
                  {selectedRequest.userEmail}
                </Text>
              </div>
            </div>

            <div className="detail-row">
              <Text strong>USDT Quantity:</Text>
              <Text className="amount">
                {formatCurrency(selectedRequest.usdtQuantity)}
              </Text>
            </div>

            <div className="detail-row">
              <Text strong>Wallet Balance:</Text>
              <Text className="balance">
                {formatCurrency(selectedRequest.walletBalance)}
              </Text>
            </div>

            <div className="detail-row">
              <Text strong>Requested At:</Text>
              <Text>
                {dayjs(selectedRequest.requestedAt).format(
                  "MMM DD, YYYY HH:mm"
                )}
              </Text>
            </div>

            {selectedRequest.status === 'REJECTED' && selectedRequest.remarks && (
              <div className="detail-row">
                <Text strong>Rejection Reason:</Text>
                <Text type="danger" className="rejection-reason">
                  {selectedRequest.remarks}
                </Text>
              </div>
            )}

            {selectedRequest.status === 'APPROVED' && selectedRequest.transactionId && (
              <div className="detail-row">
                <Text strong>Transaction ID:</Text>
                <Text code className="transaction-id">
                  {selectedRequest.transactionId}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Approve Withdrawal Request"
        open={isApproveModalVisible}
        onCancel={() => setIsApproveModalVisible(false)}
        footer={null}
        width={500}
        className="approve-modal"
      >
        {currentRequest && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Text strong>User Wallet Address:</Text>
              <div style={{ marginTop: "10px" }}>
                <QRCode
                  value={currentRequest.walletAddress || currentRequest.id}
                  size={200}
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <Text
                  copyable={{
                    text: currentRequest.walletAddress || currentRequest.id,
                  }}
                >
                  {currentRequest.walletAddress || currentRequest.id}
                </Text>
              </div>
            </div>

            <Form
              form={approveForm}
              onFinish={handleApproveSubmit}
              layout="vertical"
            >
              <Form.Item
                name="transactionId"
                label="Transaction ID"
                rules={[
                  {
                    required: true,
                    message: "Please enter the transaction ID",
                  },
                ]}
              >
                <Input placeholder="Enter transaction ID" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={() => setIsApproveModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Approve
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Withdrawal Request"
        open={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        footer={null}
        width={500}
        className="reject-modal"
      >
        {currentRequest && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <Text>
                Are you sure you want to reject this withdrawal request?
              </Text>
            </div>

            <Form
              form={rejectForm}
              onFinish={handleRejectSubmit}
              layout="vertical"
            >
              <Form.Item
                name="remarks"
                label="Rejection Remarks"
                rules={[
                  {
                    required: true,
                    message: "Please provide rejection remarks",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter reason for rejection"
                  rows={4}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={() => setIsRejectModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" danger htmlType="submit">
                    Reject
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Verify Transaction Modal */}
      <Modal
        title="Verify Transaction"
        open={isVerifyModalVisible}
        onCancel={() => setIsVerifyModalVisible(false)}
        footer={null}
        width={500}
        className="verify-modal"
      >
        {currentRequest && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <Text>
                Verify that the transaction has been completed for this withdrawal request.
              </Text>
            </div>

            <Form
              form={verifyForm}
              onFinish={handleVerifySubmit}
              layout="vertical"
            >
              <Form.Item
                name="transactionId"
                label="Transaction ID"
                rules={[
                  {
                    required: true,
                    message: "Please enter the transaction ID",
                  },
                ]}
              >
                <Input placeholder="Enter transaction ID to verify" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={() => setIsVerifyModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Verify Transaction
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminWithdrawRequests;
