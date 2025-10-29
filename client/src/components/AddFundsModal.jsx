/**
 * Add Funds Modal Component - USDT Investment Platform
 * 
 * This modal component handles the complete process of adding funds to a user's account
 * through USDT deposits. It provides a step-by-step interface for users to:
 * - View the system's USDT wallet address
 * - Generate QR codes for easy mobile payments
 * - Submit transaction IDs for verification
 * - Track verification status and receive confirmations
 * 
 * Key Features:
 * - Step-by-step deposit process
 * - QR code generation for mobile payments
 * - Transaction ID verification
 * - Real-time verification status
 * - Copy-to-clipboard functionality
 * - Automatic wallet address fetching
 * 
 * Process Flow:
 * 1. Display system wallet address and QR code
 * 2. User makes USDT transfer to displayed address
 * 3. User submits transaction ID for verification
 * 4. System verifies transaction on blockchain
 * 5. User's balance is updated upon successful verification
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Input,
  Button,
  Typography,
  Card,
  Space,
  Alert,
  Divider,
  QRCode,
  Row,
  Col,
} from "antd";
import {
  QrcodeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  ReloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { verifyPayment } from "../api_calls/paymentApi";
import { getActiveWallet } from "../api_calls/walletApi";
import "../styles/components/AddFundsModal.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * Add Funds Modal Component
 * 
 * This component provides a comprehensive interface for users to deposit USDT
 * into their investment accounts. It handles the entire deposit workflow from
 * displaying wallet information to verifying transactions.
 * 
 * State Management:
 * - transactionId: User-entered transaction ID for verification
 * - isVerifying: Loading state during transaction verification
 * - isVerified: Success state after successful verification
 * - activeWallet: System wallet information for deposits
 * - isLoadingWallet: Loading state while fetching wallet data
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {function} props.onClose - Callback when modal is closed
 * @param {Object} props.user - Current user data
 * @returns {JSX.Element} Add funds modal interface
 */
const AddFundsModal = ({ visible, onClose, user }) => {
  const [transactionId, setTransactionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const { login } = useAuth();

  /**
   * Initialize Modal State
   * 
   * This effect runs when the modal becomes visible and resets all state
   * to ensure a clean experience for each deposit attempt. It also fetches
   * the current active wallet information.
   */
  useEffect(() => {
    if (visible) {
      setTransactionId("");
      setIsVerifying(false);
      setIsVerified(false);
      fetchActiveWallet();
    }
  }, [visible]);

  /**
   * Fetch Active Wallet Information
   * 
   * Retrieves the current active wallet address from the system.
   * This wallet address is where users should send their USDT deposits.
   * The wallet information is used to generate QR codes and display
   * the correct deposit address to users.
   */
  const fetchActiveWallet = async () => {
    setIsLoadingWallet(true);
    try {
      const response = await getActiveWallet();
      if (response.success) {
        setActiveWallet(response.data);
      } else {
        toast.error("Failed to load wallet information");
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error("Error loading wallet information");
    } finally {
      setIsLoadingWallet(false);
    }
  };

  /**
   * Copy Wallet Address to Clipboard
   * 
   * Copies the system wallet address to the user's clipboard for easy
   * pasting into their wallet application. Provides user feedback through
   * toast notifications.
   */
  const copyWalletAddress = () => {
    if (activeWallet?.walletId) {
      navigator.clipboard.writeText(activeWallet.walletId);
      toast.success("Wallet address copied to clipboard!");
    }
  };

  /**
   * Verify Payment Transaction
   * 
   * This function handles the verification of user-submitted transaction IDs.
   * It communicates with the backend to verify the transaction on the blockchain
   * and update the user's account balance upon successful verification.
   * 
   * Process Flow:
   * 1. Validate transaction ID input
   * 2. Send verification request to backend
   * 3. Backend verifies transaction on TRON blockchain
   * 4. Update user balance if verification succeeds
   * 5. Refresh user session with updated data
   * 6. Provide user feedback on success/failure
   * 
   * @param {string} txId - Transaction ID to verify
   * @param {string} userId - User ID making the deposit
   */
  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID");
      return;
    }

    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyPayment({
        txId: transactionId,
        userId: user._id,
      });

      if (result.success) {
        setIsVerified(true);
        toast.success("Payment verified successfully!");
        
        if (result.data?.newBalance) {
          const updatedUser = {
            ...user,
            balance: result.data.newBalance,
          };
          login(updatedUser, "user");
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Error verifying payment. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Determine Current Step
   * 
   * Calculates the current step in the deposit process based on user actions.
   * This is used to display the appropriate step indicator and content.
   * 
   * @returns {number} Current step number (0-2)
   */
  const getCurrentStep = () => {
    if (isVerified) return 2;
    if (transactionId.trim()) return 1;
    return 0;
  };

  /**
   * Render Step Content
   * 
   * Renders the appropriate content based on the current step in the deposit process.
   * Each step provides different information and actions for the user.
   * 
   * @param {number} step - Current step number
   * @returns {JSX.Element} Step-specific content
   */
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="step-content">
            <Title level={4}>Step 1: Send USDT to Our Wallet</Title>
            <Paragraph>
              Send USDT to the wallet address below. You can scan the QR code
              with your mobile wallet or copy the address manually.
            </Paragraph>
            
            {isLoadingWallet ? (
              <div className="loading-container">
                <ClockCircleOutlined spin className="loading-icon" />
                <Text>Loading wallet information...</Text>
              </div>
            ) : activeWallet ? (
              <Card className="wallet-card">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  <div className="wallet-address-section">
                    <Text strong>Wallet Address:</Text>
                    <div className="address-container">
                      <Text code className="wallet-address">
                        {activeWallet.walletId}
                      </Text>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={copyWalletAddress}
                        className="copy-button"
                      />
                    </div>
                  </div>
                  
                  <Divider>OR</Divider>
                  
                  <div className="qr-section">
                    <Text strong>Scan QR Code:</Text>
                    <div className="qr-container">
                      <QRCode
                        value={activeWallet.walletId}
                        size={200}
                        icon={<DollarOutlined />}
                      />
                    </div>
                  </div>
                </Space>
              </Card>
            ) : (
              <Alert
                message="Error"
                description="Failed to load wallet information. Please try again."
                type="error"
                action={
                  <Button size="small" onClick={fetchActiveWallet}>
                    <ReloadOutlined /> Retry
                  </Button>
                }
              />
            )}
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <Title level={4}>Step 2: Verify Your Transaction</Title>
            <Paragraph>
              Enter the transaction ID (TXID) from your USDT transfer to verify
              and credit your account.
            </Paragraph>
            
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text strong>Transaction ID:</Text>
                <TextArea
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID here..."
                  rows={3}
                  className="transaction-input"
                />
              </div>
              
              <Button
                type="primary"
                size="large"
                loading={isVerifying}
                onClick={handleVerifyPayment}
                disabled={!transactionId.trim()}
                className="verify-button"
              >
                {isVerifying ? "Verifying..." : "Verify Payment"}
              </Button>
            </Space>
          </div>
        );

      case 2:
        return (
          <div className="step-content success-content">
            <div className="success-icon">
              <CheckCircleOutlined />
            </div>
            <Title level={4}>Payment Verified Successfully!</Title>
            <Paragraph>
              Your USDT deposit has been verified and added to your account balance.
              You can now use these funds to make investments.
            </Paragraph>
            <Text type="secondary">
              This window will close automatically in a few seconds...
            </Text>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <Space>
          <DollarOutlined />
          <span>Add Funds</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="add-funds-modal"
    >
      <div className="modal-content">
        <Steps
          current={getCurrentStep()}
          items={[
            {
              title: "Send USDT",
              description: "Transfer to our wallet",
              icon: <QrcodeOutlined />,
            },
            {
              title: "Verify",
              description: "Submit transaction ID",
              icon: <ClockCircleOutlined />,
            },
            {
              title: "Complete",
              description: "Funds added to account",
              icon: <CheckCircleOutlined />,
            },
          ]}
          className="deposit-steps"
        />
        
        <div className="step-content-wrapper">
          {renderStepContent(getCurrentStep())}
        </div>
      </div>
    </Modal>
  );
};

export default AddFundsModal;