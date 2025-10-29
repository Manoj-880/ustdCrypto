import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Typography, Select, message, Spin } from 'antd';
import { WalletOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getAllLockinPlans, addLockinToWallet, relock } from '../api_calls/lockinApi';
import { updateUserSession } from '../utils/sessionUtils';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const LockinMaturityModal = ({ visible, lockin, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'wallet' or 'relock'
  const [lockinPlans, setLockinPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    if (visible && actionType === 'relock') {
      loadLockinPlans();
    }
  }, [visible, actionType]);

  const loadLockinPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await getAllLockinPlans();
      if (response.success) {
        setLockinPlans(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedPlanId(response.data[0]._id);
        }
      } else {
        message.error(response.message || 'Failed to load lock-in plans');
      }
    } catch (error) {
      console.error('Error loading lock-in plans:', error);
      message.error('Failed to load lock-in plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleAddToWallet = async () => {
    if (!lockin || !user) return;

    setLoading(true);
    try {
      const response = await addLockinToWallet(lockin._id, user._id);
      
      if (response.success) {
        message.success('Lock-in amount added to wallet successfully!');
        
        // Update user session with new balance
        if (response.data?.user) {
          updateUserSession({
            user: response.data.user,
          });
          login(response.data.user);
        }
        
        onSuccess?.();
        onClose();
      } else {
        message.error(response.message || 'Failed to add to wallet');
      }
    } catch (error) {
      console.error('Error adding to wallet:', error);
      message.error('Failed to add lock-in to wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleRelock = async () => {
    if (!lockin || !user || !selectedPlanId) {
      message.warning('Please select a lock-in plan');
      return;
    }

    setLoading(true);
    try {
      const response = await relock(lockin._id, user._id, selectedPlanId);
      
      if (response.success) {
        message.success('Lock-in relocked successfully!');
        
        // Update user session
        if (response.data?.user) {
          updateUserSession({
            user: response.data.user,
          });
          login(response.data.user);
        }
        
        onSuccess?.();
        onClose();
      } else {
        message.error(response.message || 'Failed to relock');
      }
    } catch (error) {
      console.error('Error relocking:', error);
      message.error('Failed to relock');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' USDT';
  };

  if (!lockin) return null;

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
          <Title level={4} style={{ margin: 0 }}>
            Lock-In Matured! 🎉
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <div style={{ padding: '20px 0' }}>
        <Paragraph>
          Your lock-in <Text strong style={{ color: '#1677ff' }}>{lockin.name}</Text> has reached maturity!
        </Paragraph>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Amount:</Text>
              <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                {formatCurrency(parseFloat(lockin.amount))}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Duration:</Text>
              <Text>{lockin.planDuration} days</Text>
            </div>
          </Space>
        </div>

        {!actionType ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={5}>What would you like to do?</Title>
            
            <Button
              type="primary"
              size="large"
              icon={<WalletOutlined />}
              block
              onClick={() => setActionType('wallet')}
              style={{
                height: '50px',
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none'
              }}
            >
              Add to Wallet
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              block
              onClick={() => setActionType('relock')}
              style={{
                height: '50px',
                background: 'linear-gradient(135deg, #1677ff 0%, #40a9ff 100%)',
                border: 'none'
              }}
            >
              Relock
            </Button>
          </Space>
        ) : actionType === 'wallet' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Paragraph>
              Transfer <Text strong>{formatCurrency(parseFloat(lockin.amount))}</Text> to your wallet balance?
            </Paragraph>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setActionType(null)} disabled={loading}>
                Back
              </Button>
              <Button
                type="primary"
                icon={<WalletOutlined />}
                onClick={handleAddToWallet}
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  border: 'none'
                }}
              >
                Confirm
              </Button>
            </Space>
          </Space>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Paragraph>
              Select a lock-in plan to reinvest <Text strong>{formatCurrency(parseFloat(lockin.amount))}</Text>:
            </Paragraph>

            {loadingPlans ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
                <div style={{ marginTop: '10px' }}>
                  <Text>Loading plans...</Text>
                </div>
              </div>
            ) : (
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Select a lock-in plan"
                value={selectedPlanId}
                onChange={setSelectedPlanId}
              >
                {lockinPlans.map((plan) => (
                  <Option key={plan._id} value={plan._id}>
                    {plan.planName} - {plan.duration} days ({plan.interestRate}% daily)
                  </Option>
                ))}
              </Select>
            )}

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setActionType(null)} disabled={loading}>
                Back
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRelock}
                loading={loading}
                disabled={!selectedPlanId || loadingPlans}
                style={{
                  background: 'linear-gradient(135deg, #1677ff 0%, #40a9ff 100%)',
                  border: 'none'
                }}
              >
                Relock Now
              </Button>
            </Space>
          </Space>
        )}
      </div>
    </Modal>
  );
};

export default LockinMaturityModal;

