import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Radio,
  Card,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  WalletOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../styles/pages/adminPages/adminWallets.css";

const { Title, Text } = Typography;

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [activeWalletId, setActiveWalletId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockWallets = [
      {
        id: "W001",
        name: "Main USDT Wallet",
      },
      {
        id: "W002", 
        name: "Cold Storage Wallet",
      },
      {
        id: "W003",
        name: "Trading Wallet",
      },
      {
        id: "W004",
        name: "Backup Wallet",
      },
      {
        id: "W005",
        name: "Test Wallet",
      },
    ];
    setWallets(mockWallets);
    setFilteredWallets(mockWallets);
    // Set first wallet as active by default
    if (mockWallets.length > 0) {
      setActiveWalletId(mockWallets[0].id);
    }
  }, []);

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

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newWallet = {
        id: `W${String(wallets.length + 1).padStart(3, "0")}`,
        name: values.name,
      };
      setWallets([...wallets, newWallet]);
      message.success("Wallet added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleWalletSelect = (e) => {
    setActiveWalletId(e.target.value);
  };

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
        {filteredWallets.map((wallet) => (
          <Card key={wallet.id} className="wallet-card">
            <div className="wallet-content">
              <div className="wallet-left">
                <div className="wallet-name">{wallet.name}</div>
                <div className="wallet-id">ID: {wallet.id}</div>
              </div>
              <div className="wallet-right">
                <div className="wallet-balance">0.00 USDT</div>
                <div className="wallet-actions">
                  {activeWalletId === wallet.id ? (
                    <div className="active-status">
                      <div className="status-dot"></div>
                      <span>Active</span>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => setActiveWalletId(wallet.id)}
                      className="activate-btn"
                    >
                      Set Active
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Wallet Modal */}
      <Modal
        title="Add New Wallet"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={400}
        className="wallet-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Wallet Name"
            rules={[{ required: true, message: "Please enter wallet name" }]}
          >
            <Input placeholder="Enter wallet name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminWallets;
