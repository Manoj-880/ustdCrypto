import React, { useState } from 'react';
import { Modal, Row, Col, Typography, Input, Button, Select, Space, Divider, Alert, Card, Form, message } from 'antd';
import { MinusOutlined, SwapOutlined, DollarOutlined, InfoCircleOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { createWithdrawalRequest, transferToWallet } from '../api_calls/withdrawalApi';
import '../styles/components/WithdrawModal.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WithdrawModal = ({ visible, onClose, user }) => {
  const [withdrawType, setWithdrawType] = useState('withdraw');
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();

  const handleWithdraw = async () => {
    try {
      const values = await form.validateFields();
      
      if (!values.amount || parseFloat(values.amount) <= 0) {
        message.error('Please enter a valid amount');
        return;
      }

      if (withdrawType === 'transfer' && !values.recipientEmail) {
        message.error('Please enter recipient email');
        return;
      }

      if (parseFloat(values.amount) > parseFloat(user.balance)) {
        message.error('Insufficient balance');
        return;
      }

      setLoading(true);
      
      if (withdrawType === 'withdraw') {
        // Create withdrawal request
        const result = await createWithdrawalRequest({
          userId: user._id,
          amount: parseFloat(values.amount),
          walletAddress: user.walletId || 'N/A',
          remarks: values.remarks || null
        });
        
        if (result.success) {
          message.success('Withdrawal request submitted successfully');
          // Update user balance in localStorage (subtract the withdrawn amount)
          const updatedUser = {
            ...user,
            balance: (parseFloat(user.balance) - parseFloat(values.amount)).toFixed(2)
          };
          const sessionData = {
            user: updatedUser,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          login(updatedUser);
        } else {
          message.error(result.message || 'Withdrawal request failed');
        }
      } else {
        // Transfer to wallet
        const result = await transferToWallet({
          fromUserId: user._id,
          recipientEmail: values.recipientEmail,
          amount: parseFloat(values.amount)
        });
        
        if (result.success) {
          message.success('Transfer completed successfully');
          // Update user balance in localStorage (subtract the transferred amount)
          const updatedUser = {
            ...user,
            balance: (parseFloat(user.balance) - parseFloat(values.amount)).toFixed(2)
          };
          const sessionData = {
            user: updatedUser,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          login(updatedUser);
        } else {
          message.error(result.message || 'Transfer failed');
        }
      }
      
      handleClose();
    } catch (error) {
      console.error('Transaction error:', error);
      message.error('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWithdrawType('withdraw');
    setAmount('');
    setRecipientEmail('');
    form.resetFields();
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

          <Form
            form={form}
            layout="vertical"
            className="withdraw-form"
            onFinish={handleWithdraw}
          >
            <Form.Item
              label="Transaction Type"
              name="transactionType"
              initialValue="withdraw"
            >
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
            </Form.Item>

            <Form.Item
              label="Amount (USDT)"
              name="amount"
              rules={[
                { required: true, message: 'Please enter amount' },
                { 
                  validator: (_, value) => {
                    if (value && parseFloat(value) <= 0) {
                      return Promise.reject('Amount must be greater than 0');
                    }
                    if (value && parseFloat(value) > parseFloat(user.balance)) {
                      return Promise.reject('Insufficient balance');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                type="number"
                placeholder="Enter amount"
                className="amount-input"
                size="large"
                prefix={<DollarOutlined />}
                suffix="USDT"
                min="0"
                step="0.01"
              />
            </Form.Item>

            {withdrawType === 'transfer' && (
              <Form.Item
                label="Recipient Email"
                name="recipientEmail"
                rules={[
                  { required: true, message: 'Please enter recipient email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  placeholder="Enter recipient email address"
                  className="email-input"
                  size="large"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            )}

            <Form.Item
              label="Remarks (Optional)"
              name="remarks"
            >
              <Input.TextArea
                placeholder="Add any additional notes or remarks..."
                className="remarks-input"
                size="large"
                rows={3}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <div className="balance-info">
              <Text type="secondary">Available Balance: </Text>
              <Text strong className="balance-amount">
                {user?.balance ? parseFloat(user.balance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }) : '0.00'} USDT
              </Text>
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
                htmlType="submit"
                loading={loading}
                className="withdraw-button"
                block
              >
                {loading ? 'Processing...' : `${withdrawType === 'withdraw' ? 'Withdraw' : 'Transfer'} Funds`}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
