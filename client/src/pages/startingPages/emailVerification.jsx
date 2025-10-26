import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Alert, Spin, Result } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons';
import { verifyEmail, resendVerificationEmail } from '../../api_calls/emailVerificationApi';
import '../../styles/pages/startingPages/emailVerification.css';

const { Title, Text, Paragraph } = Typography;

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error, expired
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setVerificationStatus('error');
      setMessage('No verification token provided');
    }
  }, [token]);

  const handleVerification = async () => {
    setLoading(true);
    try {
      console.log('Attempting verification with token:', token);
      const response = await verifyEmail(token);
      console.log('Verification response:', response);
      
      if (response.success) {
        setVerificationStatus('success');
        setMessage('Your email has been verified successfully! You can now log in to your account.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(response.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setResendLoading(true);
    try {
      const response = await resendVerificationEmail(email);
      
      if (response.success) {
        setMessage('Verification email sent successfully! Please check your inbox.');
        setVerificationStatus('pending');
      } else {
        setMessage(response.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('An error occurred while resending the verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="verification-loading">
          <Spin size="large" />
          <Text>Verifying your email...</Text>
        </div>
      );
    }

    switch (verificationStatus) {
      case 'success':
        return (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '64px' }} />}
            title="Email Verified Successfully!"
            subTitle={message}
            extra={[
              <Button type="primary" key="login" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            ]}
          />
        );

      case 'error':
        return (
          <Result
            status="error"
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '64px' }} />}
            title="Verification Failed"
            subTitle={message}
            extra={[
              <div key="resend-form" className="resend-form">
                <Title level={4}>Resend Verification Email</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="email-input"
                  />
                  <Button
                    type="primary"
                    loading={resendLoading}
                    onClick={handleResendVerification}
                    icon={<MailOutlined />}
                  >
                    Resend Verification Email
                  </Button>
                </Space>
              </div>,
              <Button key="home" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            ]}
          />
        );

      default:
        return (
          <div className="verification-pending">
            <MailOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '24px' }} />
            <Title level={2}>Email Verification</Title>
            <Paragraph>
              Please check your email and click the verification link to activate your account.
            </Paragraph>
            <Alert
              message="Verification Required"
              description="You must verify your email address before you can access your account."
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            <div className="resend-form">
              <Title level={4}>Didn't receive the email?</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <Button
                  type="primary"
                  loading={resendLoading}
                  onClick={handleResendVerification}
                  icon={<ReloadOutlined />}
                >
                  Resend Verification Email
                </Button>
              </Space>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <Card className="verification-card">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
