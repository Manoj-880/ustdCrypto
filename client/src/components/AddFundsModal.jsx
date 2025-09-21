import React, { useState, useEffect } from 'react';
import { Modal, Steps, Input, Button, Typography, Card, Space, Alert, Divider, QRCode, Row, Col } from 'antd';
import { 
  QrcodeOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CopyOutlined,
  ReloadOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import '../styles/components/AddFundsModal.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AddFundsModal = ({ visible, onClose, user }) => {
  const [transactionId, setTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (visible) {
      setTransactionId('');
      setIsVerifying(false);
      setIsVerified(false);
    }
  }, [visible]);



  const handleCopyWalletId = () => {
    if (user?.walletId) {
      navigator.clipboard.writeText("kjdbfk389eoukbdjlnkewdf");
      toast.success('Wallet ID copied to clipboard!', { position: 'top-right' });
    }
  };

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID', { position: 'top-right' });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call for verification
    setTimeout(() => {
      // Mock verification logic
      const isVerified = Math.random() > 0.3; // 70% success rate for demo
      
      if (isVerified) {
        toast.success('Payment verified successfully! Funds will be added to your account shortly.', { position: 'top-right' });
        setIsVerified(true);
      } else {
        toast.error('Transaction verification failed. Please check your transaction ID and try again.', { position: 'top-right' });
      }
      
      setIsVerifying(false);
    }, 2000);
  };


  return (
    <Modal
      title={
        <div className="modal-header">
          <DollarOutlined className="modal-icon" />
          <span>Add Funds to Wallet</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="add-funds-modal"
      centered
    >
      <div className="add-funds-content">
        {!isVerified ? (
          <>
            <Title level={4} className="step-title">
              Add Funds to Your Wallet
            </Title>
            
            <Alert
              message="Important Notice"
              description="Please verify your payment after making the transfer. Enter the transaction ID to complete the process."
              type="info"
              showIcon
              className="verification-notice"
            />

            <Row gutter={[24, 24]} className="modal-row">
              {/* Left Column - QR Code and Wallet Info */}
              <Col xs={24} md={12} className="qr-column">
                <Card className="qr-card">
                  <div className="qr-container">
                    <QRCode
                      value="kjdbfk389eoukbdjlnkewdf"
                      size={180}
                      color="#000000"
                      bgColor="#FFFFFF"
                      bordered={false}
                      className="qr-image"
                    />
                  </div>
                  
                  <div className="wallet-details">
                    <Title level={5}>Wallet Information</Title>
                    <div className="wallet-info">
                      <Text strong>Wallet ID:</Text>
                      <div className="wallet-id-container">
                        <Text code className="wallet-id">kjdbfk389eoukbdjlnkewdf</Text>
                        <Button 
                          type="text" 
                          icon={<CopyOutlined />} 
                          onClick={handleCopyWalletId}
                          className="copy-btn"
                        />
                      </div>
                    </div>
                    <div className="wallet-info">
                      <Text strong>Network:</Text>
                      <Text>TRC20 (Tron)</Text>
                    </div>
                    <div className="wallet-info">
                      <Text strong>Currency:</Text>
                      <Text>USDT</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Right Column - Transaction Form */}
              <Col xs={24} md={12} className="form-column">
                <Card className="verification-card">
                  <div className="verification-form">
                    <Title level={5} className="form-title">Verify Your Payment</Title>
                    
                    <div className="form-group">
                      <label className="form-label">Transaction ID (TXID)</label>
                      <TextArea
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter the transaction ID from your wallet"
                        rows={4}
                        className="transaction-input"
                      />
                      <Text type="secondary" className="help-text">
                        You can find this in your wallet's transaction history
                      </Text>
                    </div>

                    <div className="verification-actions">
                      <div className="modal-actions">
                        <Button 
                          onClick={onClose}
                          className="cancel-button"
                          size="large"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="primary" 
                          onClick={handleVerifyPayment}
                          loading={isVerifying}
                          className="verify-btn"
                          size="large"
                        >
                          {isVerifying ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="instructions">
                  <Title level={5}>Instructions:</Title>
                  <ol>
                    <li>Open your USDT wallet app (TronLink, Trust Wallet, etc.)</li>
                    <li>Scan the QR code or copy the wallet ID</li>
                    <li>Send USDT to the wallet address</li>
                    <li>Copy the transaction ID from your wallet</li>
                    <li>Enter the transaction ID and click "Verify"</li>
                  </ol>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <div className="step-content">
            <div className="success-content">
              <CheckCircleOutlined className="success-icon" />
              <Title level={3} className="success-title">
                Payment Verified Successfully!
              </Title>
              <Paragraph className="success-description">
                Your USDT has been received and will be added to your account balance shortly. 
                You can check your updated balance in the dashboard.
              </Paragraph>
              
              <div className="success-actions">
                <Button type="primary" onClick={onClose} size="large">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddFundsModal;
