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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUsers = [
        {
          key: "1",
          id: "U001",
          name: "John Doe",
          email: "john.doe@example.com",
          joinDate: "2024-01-10",
          status: "active",
          balance: 1500.0,
          profit: 250.0,
          lastLogin: "2024-01-15 14:30:00",
          totalTransactions: 25,
        },
        {
          key: "2",
          id: "U002",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          joinDate: "2024-01-12",
          status: "active",
          balance: 750.0,
          profit: 150.0,
          lastLogin: "2024-01-15 13:45:00",
          totalTransactions: 18,
        },
        {
          key: "3",
          id: "U003",
          name: "Bob Wilson",
          email: "bob.wilson@example.com",
          joinDate: "2024-01-14",
          status: "pending",
          balance: 0.0,
          profit: 0.0,
          lastLogin: "Never",
          totalTransactions: 0,
        },
        {
          key: "4",
          id: "U004",
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          joinDate: "2024-01-08",
          status: "suspended",
          balance: 200.0,
          profit: 50.0,
          lastLogin: "2024-01-12 10:20:00",
          totalTransactions: 12,
        },
        {
          key: "5",
          id: "U005",
          name: "Charlie Brown",
          email: "charlie.brown@example.com",
          joinDate: "2024-01-05",
          status: "active",
          balance: 3200.0,
          profit: 500.0,
          lastLogin: "2024-01-15 16:15:00",
          totalTransactions: 45,
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Sort users function
  const sortUsers = (users, sortBy) => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case "profit":
          return b.profit - a.profit; // Descending order
        case "joinDate":
          return new Date(b.joinDate) - new Date(a.joinDate); // Descending order (newest first)
        case "name":
          return a.name.localeCompare(b.name); // Alphabetical order
        case "balance":
          return b.balance - a.balance; // Descending order
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
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Sort users
    filtered = sortUsers(filtered, sortBy);

    setFilteredUsers(filtered);
  }, [users, searchText, statusFilter, sortBy]);

  const handleViewUser = (user) => {
    navigate(`/admin/user/${user.id}`);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // Handle edit user logic here
    console.log("Edit user:", user);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: (text) => <Text className="user-name">{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      render: (text) => <Text className="user-email">{text}</Text>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 100,
      render: (balance) => (
        <Text className="balance-cell">{balance.toFixed(2)} USDT</Text>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 100,
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      width: 100,
      render: (profit) => (
        <Text className={profit >= 0 ? "profit-positive" : "profit-negative"}>
          {profit.toFixed(2)} USDT
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
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
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const usersThisMonth = users.filter((user) => {
    const joinDate = new Date(user.joinDate);
    const currentDate = new Date();
    return joinDate.getMonth() === currentDate.getMonth() && 
           joinDate.getFullYear() === currentDate.getFullYear();
  }).length;

  // Mobile Card Component
  const renderMobileCard = (user) => (
    <Card key={user.id} className="mobile-user-card" hoverable>
      <div className="mobile-card-header">
        <div className="user-avatar-section">
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            className="user-avatar"
            style={{ backgroundColor: user.status === 'active' ? '#52c41a' : '#f5222d' }}
          />
          <div className="user-info">
            <Title level={5} className="user-name">{user.name}</Title>
            <Text type="secondary" className="user-email">{user.email}</Text>
          </div>
        </div>
        <Tag color={user.status === 'active' ? 'green' : 'red'} className="status-tag">
          {user.status.toUpperCase()}
        </Tag>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-content">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Balance</Text>
              <Text strong className="stat-value balance-value">
                {user.balance.toFixed(2)} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Profit</Text>
              <Text 
                strong 
                className={`stat-value ${user.profit >= 0 ? 'profit-positive' : 'profit-negative'}`}
              >
                {user.profit >= 0 ? '+' : ''}{user.profit.toFixed(2)} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Join Date</Text>
              <Text className="stat-value">{user.joinDate}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">User ID</Text>
              <Text className="stat-value user-id">{user.id}</Text>
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
            {filteredUsers.map(renderMobileCard)}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
              className: "users-pagination",
            }}
            className="users-table"
          />
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
            This action cannot be undone. All user data, transactions, and account information will be permanently deleted.
          </Text>
          {userToDelete && (
            <div className="user-preview">
              <Text strong>User: {userToDelete.name}</Text>
              <Text type="secondary">Email: {userToDelete.email}</Text>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
