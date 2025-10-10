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
} from "@ant-design/icons";
import "../../styles/pages/adminPages/adminUserDetails.css";
import { getUserById } from "../../api_calls/userApi";
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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setDeleteModalVisible(false);
      message.success("User deleted successfully!");
      navigate("/admin/users");
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "suspended":
        return "orange";
      default:
        return "blue";
    }
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
                {userData?.name}
              </Title>
              <Text className="user-email">{userData?.email}</Text>
              <Text className="user-id">ID: {userData?.id}</Text>
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
              <div className="info-value">{userData?.name}</div>
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
              <div className="info-value">{userData?.phone}</div>
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
                <IdcardOutlined className="info-icon" />
                Status
              </div>
              <div className="info-value">
                <Tag
                  color={getStatusColor(userData?.status)}
                  className="status-tag"
                >
                  {userData?.status?.toUpperCase()}
                </Tag>
              </div>
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
                    {userData?.id}
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
                    {userData?.referredBy}
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
            <Text strong>User: {userData?.name}</Text>
            <Text type="secondary">Email: {userData?.email}</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserDetails;
