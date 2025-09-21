import React, { useState } from 'react';
import { Modal, Row, Col, Typography, Input, Button, Select, Space, Divider, Alert, Card } from 'antd';
import { MinusOutlined, SwapOutlined, DollarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '../styles/components/WithdrawModal.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WithdrawModal = ({ visible, onClose, user }) => {
  const [withdrawType, setWithdrawType] = useState('withdraw');
  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user list - replace with actual API call
  const userList = [
    { id: '1', name: 'John Doe', email: 'john@example.com', walletId: 'WLT001' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', walletId: 'WLT002' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', walletId: 'WLT003' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', walletId: 'WLT004' },
    { id: '5', name: 'David Brown', email: 'david@example.com', walletId: 'WLT005' },
  ];

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (withdrawType === 'transfer' && !selectedUser) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const transferData = withdrawType === 'transfer' 
        ? { amount, fromUser: user?.walletId, toUser: selectedUser }
        : { amount, user: user?.walletId };
      
      console.log(`${withdrawType} request:`, transferData);
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setWithdrawType('withdraw');
    setAmount('');
    setSelectedUser('');
    onClose();
  };

  return (
    <Modal
      title={
        <div className="withdraw-modal-header">
          <MinusOutlined className="withdraw-icon" />
          <Title level={3} className="withdraw-title">
            {withdrawType === 'withdraw' ? 'Withdraw Funds' : 'Transfer Funds'}
          </Title>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      className="withdraw-modal"
      centered
    >
      <div className="withdraw-modal-content">
        <Card className="withdraw-form-card">
          <Title level={4} className="form-title">
            <DollarOutlined /> Transaction Details
          </Title>

          <div className="withdraw-form">
            <div className="form-group">
              <Text className="form-label">Transaction Type</Text>
              <Select
                value={withdrawType}
                onChange={setWithdrawType}
                className="withdraw-type-select"
                size="large"
              >
                <Option value="withdraw">
                  <Space>
                    <MinusOutlined />
                    <span>Withdraw to Bank</span>
                  </Space>
                </Option>
                <Option value="transfer">
                  <Space>
                    <SwapOutlined />
                    <span>Transfer to Wallet</span>
                  </Space>
                </Option>
              </Select>
            </div>

            <div className="form-group">
              <Text className="form-label">Amount (USDT)</Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="amount-input"
                size="large"
                prefix={<DollarOutlined />}
                suffix="USDT"
                min="0"
                step="0.01"
              />
            </div>

            {withdrawType === 'transfer' && (
              <div className="form-group">
                <Text className="form-label">Select Recipient</Text>
                <Select
                  value={selectedUser}
                  onChange={setSelectedUser}
                  placeholder="Choose a user to transfer to"
                  className="user-select"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {userList.map((user) => (
                    <Option key={user.id} value={user.walletId}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}

            <div className="balance-info">
              <Text type="secondary">Available Balance: </Text>
              <Text strong className="balance-amount">15,420.50 USDT</Text>
            </div>

            <Alert
              message="Important Notice"
              description={`${withdrawType === 'withdraw' ? 'Withdrawal' : 'Transfer'} requests are processed within 24 hours. Please ensure you have sufficient balance.`}
              type="info"
              showIcon
              className="withdraw-alert"
            />

            <div className="modal-actions">
              <Button
                size="large"
                onClick={handleClose}
                className="cancel-button"
                block
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleWithdraw}
                loading={loading}
                disabled={!amount || parseFloat(amount) <= 0 || (withdrawType === 'transfer' && !selectedUser)}
                className="withdraw-button"
                block
              >
                {loading ? 'Processing...' : `${withdrawType === 'withdraw' ? 'Withdraw' : 'Transfer'} Funds`}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
