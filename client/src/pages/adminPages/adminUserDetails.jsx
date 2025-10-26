/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Space,
  Divider,
  message,
  Modal,
  Statistic,
  Tag,
  Avatar,
  Descriptions,
  Spin,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../styles/pages/adminPages/adminUserDetails.css";
import { getUserById, addBalance, deleteUser } from "../../api_calls/userApi";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addBalanceModalVisible, setAddBalanceModalVisible] = useState(false);
  const [addBalanceLoading, setAddBalanceLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    let response = await getUserById(id);
    if (response.success) {
      setUserData(response.data);
      form.setFieldValue(response.data);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setUserData({ ...userData, ...values });
        setEditing(false);
        setLoading(false);
        message.success("User updated successfully!");
      }, 1000);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    // Convert date string to dayjs object for DatePicker
    const formData = {
      ...userData,
      joinDate: dayjs(userData.joinDate),
    };
    form.setFieldsValue(formData);
    setEditing(false);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteUser(userData._id);
      if (response.success) {
        setDeleteModalVisible(false);
        message.success("User deleted successfully!");
        toast.success("User deleted successfully!");
        navigate("/admin/users");
      } else {
        message.error(response.message || "Failed to delete user");
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      message.error("Failed to delete user. Please try again.");
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = () => {
    setAddBalanceModalVisible(true);
  };

  const handleAddBalanceSubmit = async (values) => {
    setAddBalanceLoading(true);
    try {
      const result = await addBalance(
        userData._id,
        values.amount,
        values.reason
      );
      
      if (result.success) {
        // Update user data with new balance
        setUserData({
          ...userData,
          balance: result.data.newBalance
        });
        
        setAddBalanceModalVisible(false);
        form.resetFields();
        message.success(`Successfully added ${values.amount} USDT to user balance!`);
        toast.success(`Balance added successfully! Email notification sent to ${userData.email}`);
      } else {
        message.error(result.message || 'Failed to add balance');
        toast.error(result.message || 'Failed to add balance');
      }
    } catch (error) {
      console.error('Add balance error:', error);
      message.error('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setAddBalanceLoading(false);
    }
  };

  const handleAddBalanceCancel = () => {
    setAddBalanceModalVisible(false);
    form.resetFields();
  };

  if (loading && !userData) {
    return (
      <div className="admin-user-details">
        <div className="loading-container">
          <Spin size="large" />
          <Text>Loading user details...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-details">
      {/* User Profile Card */}
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-main">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="user-avatar"
            />
            <div className="profile-info">
              <Title level={2} className="user-name">
                {userData?.firstName} {userData?.lastName}
              </Title>
              <Text className="user-email">{userData?.email}</Text>
              <Text className="user-id">ID: {userData?._id}</Text>
            </div>
          </div>
          <div className="profile-actions">
            {!editing ? (
              <div className="action-buttons">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  className="edit-btn"
                  size="large"
                >
                  Edit User
                </Button>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={handleAddBalance}
                  className="add-balance-btn"
                  size="large"
                >
                  Add Balance
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  className="delete-btn"
                  size="large"
                >
                  Delete User
                </Button>
              </div>
            ) : (
              <div className="action-buttons">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={loading}
                  className="save-btn"
                  size="large"
                >
                  Save Changes
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="cancel-btn"
                  size="large"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Balance"
              value={userData?.balance}
              prefix="USDT"
              valueStyle={{ color: "var(--color-primary)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Profit"
              value={userData?.profit}
              prefix="USDT"
              valueStyle={{ color: "var(--color-success)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Trades"
              value={userData?.totalTrades}
              valueStyle={{ color: "var(--color-info)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Win Rate"
              value={userData?.winRate}
              suffix="%"
              valueStyle={{ color: "var(--color-warning)" }}
            />
          </Card>
        </Col>
      </Row>

      {/* User Information Card */}
      <Card className="info-card">
        <Title level={4} className="card-title">
          User Information
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <UserOutlined className="info-icon" />
                Full Name
              </div>
              <div className="info-value">
                {userData?.firstName} {userData?.lastName}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <MailOutlined className="info-icon" />
                Email
              </div>
              <div className="info-value">{userData?.email}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <PhoneOutlined className="info-icon" />
                Phone
              </div>
              <div className="info-value">{userData?.mobile}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <DollarOutlined className="info-icon" />
                Balance
              </div>
              <div className="info-value">{userData?.balance} USDT</div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <TrophyOutlined className="info-icon" />
                Profit
              </div>
              <div className="info-value">{userData?.profit} USDT</div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <CalendarOutlined className="info-icon" />
                Join Date
              </div>
              <div className="info-value">{userData?.joinDate}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <EnvironmentOutlined className="info-icon" />
                Country
              </div>
              <div className="info-value">{userData?.country}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="info-item">
              <div className="info-label">
                <EnvironmentOutlined className="info-icon" />
                City
              </div>
              <div className="info-value">{userData?.city}</div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="info-item">
              <div className="info-label">
                <EnvironmentOutlined className="info-icon" />
                Address
              </div>
              <div className="info-value">{userData?.address}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Additional Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="info-card">
            <Title level={4} className="card-title">
              Account Details
            </Title>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">User ID</div>
                <div className="detail-value">
                  <Text code className="code-text">
                    {userData?._id}
                  </Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Referral Code</div>
                <div className="detail-value">
                  <Text code className="code-text">
                    {userData?.referralCode}
                  </Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Referred By</div>
                <div className="detail-value">
                  <Text code className="code-text">
                    {userData?.referredBy ? userData?.referredBy : "N/A"}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="info-card">
            <Title level={4} className="card-title">
              Financial Summary
            </Title>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Total Deposits</div>
                <div className="detail-value financial-value">
                  <Text strong>{userData?.totalDeposits} USDT</Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Withdrawals</div>
                <div className="detail-value financial-value">
                  <Text strong>{userData?.totalWithdrawals} USDT</Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Net Profit</div>
                <div className="detail-value financial-value profit-value">
                  <Text strong>{userData?.profit} USDT</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: loading }}
        className="delete-modal"
      >
        <div className="delete-content">
          <div className="delete-icon">
            <DeleteOutlined />
          </div>
          <Title level={4}>Are you sure you want to delete this user?</Title>
          <Text type="secondary">
            This action cannot be undone. All user data, transactions, and
            account information will be permanently deleted.
          </Text>
          <div className="user-preview">
            <Text strong>User: {userData?.firstName} {userData?.lastName}</Text>
            <Text type="secondary">Email: {userData?.email}</Text>
          </div>
        </div>
      </Modal>

      {/* Add Balance Modal */}
      <Modal
        title="Add Balance to User Account"
        open={addBalanceModalVisible}
        onCancel={handleAddBalanceCancel}
        footer={null}
        className="add-balance-modal"
        width={500}
        centered
      >
        <div className="add-balance-content">
          <div className="balance-info">
            <div className="current-balance">
              <Text type="secondary">Current Balance:</Text>
              <Text strong className="balance-amount">
                {userData?.balance} USDT
              </Text>
            </div>
            <div className="user-info">
              <Text type="secondary">User:</Text>
              <Text strong>{userData?.firstName} {userData?.lastName} ({userData?.email})</Text>
            </div>
          </div>

          <Form
            form={form}
            onFinish={handleAddBalanceSubmit}
            layout="vertical"
            className="add-balance-form"
          >
            <Form.Item
              name="amount"
              label="Amount to Add (USDT)"
              rules={[
                { required: true, message: 'Please enter the amount' },
                { 
                  type: 'number', 
                  min: 0.01, 
                  message: 'Amount must be greater than 0' 
                },
                {
                  validator: (_, value) => {
                    if (value && value > 10000) {
                      return Promise.reject('Amount cannot exceed 10,000 USDT');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <InputNumber
                placeholder="Enter amount"
                style={{ width: '100%' }}
                min={0.01}
                max={10000}
                step={0.01}
                precision={2}
                prefix={<DollarOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason (Optional)"
              rules={[
                { max: 200, message: 'Reason cannot exceed 200 characters' }
              ]}
            >
              <Input.TextArea
                placeholder="Enter reason for adding balance (e.g., Bonus, Refund, etc.)"
                rows={3}
                maxLength={200}
                showCount
              />
            </Form.Item>

            <div className="modal-actions">
              <Button
                onClick={handleAddBalanceCancel}
                size="large"
                className="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addBalanceLoading}
                size="large"
                className="submit-btn"
                icon={<PlusOutlined />}
              >
                Add Balance
              </Button>
            </div>
          </Form>

          <div className="balance-notice">
            <Text type="secondary" className="notice-text">
              <DollarOutlined /> This action will:
            </Text>
            <ul className="notice-list">
              <li>Add the specified amount to the user's wallet balance</li>
              <li>Create a transaction record for audit purposes</li>
              <li>Send an email notification to {userData?.email}</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserDetails;
