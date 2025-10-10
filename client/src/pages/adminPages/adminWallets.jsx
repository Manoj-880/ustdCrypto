import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Radio,
  Card,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
} from "antd";
import {
  PlusOutlined,
  WalletOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../styles/pages/adminPages/adminWallets.css";
import {
  addWalletId,
  getAllWallets,
  updateWallet,
} from "../../api_calls/walletApi";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  // const [activeWalletId, setActiveWalletId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const response = await getAllWallets();
    if (response.success) {
      setWallets(response.data);
      setFilteredWallets(response.data);
    } else {
      toast.error(response.message);
    }
  };

  // Filter wallets based on search
  useEffect(() => {
    let filtered = [...wallets];

    if (searchText) {
      filtered = filtered.filter(
        (wallet) =>
          wallet.name.toLowerCase().includes(searchText.toLowerCase()) ||
          wallet.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredWallets(filtered);
  }, [wallets, searchText]);

  const handleAddWallet = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    form.validateFields().then(async (values) => {
      console.log("Form data:", values);
      const response = await addWalletId(values);
      if (response.success) {
        setIsModalVisible(false);
        form.resetFields();
        fetchWallets();
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleChangeActive = async (id) => {
    const response = await updateWallet(id);
    if (response.success) {
      toast.success("wallet set active");
      fetchWallets();
    } else {
      toast.error(response.message);
    }
  };

  // const handleWalletSelect = (e) => {
  //   setActiveWalletId(e.target.value);
  // };

  return (
    <div className="admin-wallets">
      {/* Header */}
      <div className="admin-wallets-header">
        <Title level={2} className="page-title">
          Admin Wallets
        </Title>
        <Text className="page-tagline">
          Select the active wallet ID where user deposits will be transferred
        </Text>
      </div>

      {/* Search Bar */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={18}>
            <Input
              placeholder="Search by wallet name or ID..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddWallet}
              className="add-wallet-btn"
              block
            >
              Add Wallet
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Wallets List */}
      <div className="wallets-list">
        {filteredWallets.length > 0 ? (
          filteredWallets.map((wallet) => (
            <Card key={wallet.id} className="wallet-card">
              <div className="wallet-content">
                <div className="wallet-left">
                  <div className="wallet-name">{wallet.title}</div>
                  <div className="wallet-id">ID: {wallet.walletId}</div>
                </div>
                <div className="wallet-right">
                  <div className="wallet-balance">{wallet.balance} USDT</div>
                  <div className="wallet-actions">
                    {wallet.status === "active" ? (
                      <div className="active-status">
                        <div className="status-dot"></div>
                        <span>Active</span>
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleChangeActive(wallet._id)}
                        className="activate-btn"
                      >
                        Set Active
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <WalletOutlined />
              </div>
              <Title level={3} className="empty-state-title">
                No Wallets Added
              </Title>
              <Text className="empty-state-description">
                You haven't added any wallets yet. Click the "Add Wallet" button
                above to create your first wallet.
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddWallet}
                className="empty-state-button"
                size="large"
              >
                Add Your First Wallet
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Wallet Modal */}
      <Modal
        title="Add New Wallet"
        open={isModalVisible}
        onCancel={handleModalCancel}
        width={400}
        className="wallet-modal"
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleModalOk}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input
              placeholder="Enter title"
              size="large"
              className="form-input"
            />
          </Form.Item>
          <Form.Item
            name="walletId"
            label="Wallet ID"
            rules={[{ required: true, message: "Please enter wallet ID" }]}
          >
            <Input
              placeholder="Enter wallet ID"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleModalCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Wallet
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminWallets;
