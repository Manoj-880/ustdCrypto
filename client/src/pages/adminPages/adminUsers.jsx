/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Avatar,
  Divider,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import "../../styles/pages/adminPages/adminUsers.css";
import { getAllUsers, deleteUser } from "../../api_calls/userApi";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    let response = await getAllUsers();
    if (response.success) {
      setUsers(response.data);
      setFilteredUsers(response.data);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  // Sort users function
  const sortUsers = (users, sortBy) => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case "profit":
          return (b.profit || 0) - (a.profit || 0); // Descending order
        case "joinDate":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Descending order (newest first)
        case "name":
          const nameA = (a.firstName || '').toString();
          const nameB = (b.firstName || '').toString();
          return nameA.localeCompare(nameB); // Alphabetical order
        case "balance":
          return (b.balance || 0) - (a.balance || 0); // Descending order
        default:
          return 0;
      }
    });
  };

  // Filter users based on search and status
  useEffect(() => {
    let filtered = [...users];

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user._id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Sort users
    filtered = sortUsers(filtered, sortBy);

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchText, statusFilter, sortBy]);

  // Get paginated data
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleViewUser = (user) => {
    navigate(`/admin/user/${user._id}`);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setLoading(true);
      try {
        const response = await deleteUser(userToDelete._id);
        if (response.success) {
          // Remove user from local state
          setUsers(users.filter((user) => user._id !== userToDelete._id));
          setFilteredUsers(filteredUsers.filter((user) => user._id !== userToDelete._id));
          toast.success("User deleted successfully!");
        } else {
          toast.error(response.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("Failed to delete user. Please try again.");
      } finally {
        setLoading(false);
        setDeleteModalVisible(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      width: "20%",
      render: (text) => <Text className="user-name">{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      render: (text) => <Text className="user-email">{text}</Text>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: "15%",
      render: (balance) => {
        const value = Number(balance) || 0;
        return <Text className="balance-cell">{value.toFixed(2)} USDT</Text>;
      },
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      width: "15%",
      render: (profit) => {
        const value = Number(profit) || 0;
        return <Text className="balance-cell">{value.toFixed(2)} USDT</Text>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
            className="action-btn"
            title="View User"
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
            className="action-btn"
            title="Delete User"
          />
        </Space>
      ),
    },
  ];

  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalBalance = users.reduce((sum, user) => sum + (Number(user.balance) || 0), 0);
  const usersThisMonth = users.filter((user) => {
    const joinDate = new Date(user.joinDate);
    const currentDate = new Date();
    return (
      joinDate.getMonth() === currentDate.getMonth() &&
      joinDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  // Mobile Card Component
  const renderMobileCard = (user) => (
    <Card key={user._id} className="mobile-user-card" hoverable>
      <div className="mobile-card-header">
        <div className="user-avatar-section">
          <Avatar
            size={48}
            icon={<UserOutlined />}
            className="user-avatar"
            style={{
              backgroundColor: user.status === "active" ? "#52c41a" : "#f5222d",
            }}
          />
          <div className="user-info">
            <Title level={5} className="user-name">
              {user.firstName} {user.lastName}
            </Title>
            <Text type="secondary" className="user-email">
              {user.email}
            </Text>
          </div>
        </div>
        <Tag
          color={user.status === "active" ? "green" : "red"}
          className="status-tag"
        >
          {user.status.toUpperCase()}
        </Tag>
      </div>

      <Divider className="mobile-divider" />

      <div className="mobile-card-content">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Balance
              </Text>
              <Text strong className="stat-value balance-value">
                {user.balance ? parseFloat(user.balance).toFixed(2) : '0.00'} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Profit
              </Text>
              <Text
                strong
                className={`stat-value ${
                  user.profit >= 0 ? "profit-positive" : "profit-negative"
                }`}
              >
                {user.profit >= 0 ? "+" : ""}
                {user.profit ? parseFloat(user.profit).toFixed(2) : '0.00'} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                Join Date
              </Text>
              <Text className="stat-value">{user.joinDate}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">
                User ID
              </Text>
              <Text className="stat-value user-id">{user._id}</Text>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="mobile-divider" />

      <div className="mobile-card-actions">
        <div className="action-buttons">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(user)}
            className="mobile-action-btn"
          >
            View
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(user)}
            className="mobile-action-btn"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <Title level={2} className="dashboard-title">
          User Management
        </Title>
        <Text type="secondary" className="dashboard-subtitle">
          Manage user accounts and monitor user activity
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="stats-cards">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Users"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: "var(--color-primary)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Monthly"
              value={usersThisMonth}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "var(--color-success)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Balance"
              value={totalBalance}
              precision={2}
              prefix="USDT"
              valueStyle={{ color: "var(--color-warning)" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Sort */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={18}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Sort by..."
              value={sortBy}
              onChange={setSortBy}
              className="sort-select"
              suffixIcon={<SortAscendingOutlined />}
            >
              <Option value="name">Name A-Z</Option>
              <Option value="profit">Profit ↓</Option>
              <Option value="joinDate">Date ↓</Option>
              <Option value="balance">Balance ↓</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Users Table/Cards */}
      <Card className="table-card">
        {isMobile ? (
          <div className="mobile-cards-container">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(renderMobileCard)
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <UserOutlined />
                  </div>
                  <Title level={3} className="empty-state-title">
                    No Users Found
                  </Title>
                  <Text className="empty-state-description">
                    {searchText ? 'No users match your search criteria.' : 'No users have been registered yet.'}
                  </Text>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={getPaginatedUsers()}
              loading={loading}
              pagination={false}
              className="users-table"
              locale={{
                emptyText: (
                  <div className="table-empty-state">
                    <div className="empty-state-icon">
                      <UserOutlined />
                    </div>
                    <div className="empty-state-title">No Users Found</div>
                    <div className="empty-state-description">
                      {searchText ? 'No users match your search criteria.' : 'No users have been registered yet.'}
                    </div>
                  </div>
                )
              }}
            />
            {filteredUsers.length > 0 && (
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  total={filteredUsers.length}
                  pageSize={pageSize}
                  showSizeChanger={true}
                  showQuickJumper={true}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} users`
                  }
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  className="users-pagination"
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
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
          {userToDelete && (
            <div className="user-preview">
              <Text strong>User: {userToDelete.firstName} {userToDelete.lastName}</Text>
              <Text type="secondary">Email: {userToDelete.email}</Text>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
