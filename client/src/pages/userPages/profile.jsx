import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, Space, Divider, message, Tooltip, Modal } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById, updateUser } from '../../api_calls/userApi';
import { ShareAltOutlined, CopyOutlined, EditOutlined, SaveOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import '../../styles/pages/userPages/profile.css';

const { Title, Text } = Typography;

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const resp = await getUserById(user._id);
        if (resp?.success && resp.data) {
          setUserData(resp.data);
          form.setFieldsValue({
            firstName: resp.data.firstName,
            lastName: resp.data.lastName,
            walletId: resp.data.walletId,
          });
        }
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const referralMessage = useMemo(() => {
    const code = userData?.referralCode || '';
    const name = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
    return `Hey! ${name ? name + ' invited you to join' : 'Join'} Secure USDT. Use my referral code: ${code} to sign up and start earning. 🚀`;
  }, [userData]);

  const shareReferral = async () => {
    const text = referralMessage;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch (_) {}
    try {
      await navigator.clipboard.writeText(text);
      message.success('Referral message copied to clipboard');
    } catch (_) {
      message.info('Copy failed. Select and copy manually.');
    }
  };

  const shareLinks = useMemo(() => {
    const text = encodeURIComponent(referralMessage);
    return {
      whatsapp: `https://api.whatsapp.com/send?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=&quote=${text}`,
      instagram: '', // Instagram has no direct share URL; users can paste after copy
    };
  }, [referralMessage]);

  const handleSave = async () => {
    if (!userData?._id) return;
    try {
      const values = await form.validateFields();
      setSaving(true);
      const resp = await updateUser(userData._id, {
        firstName: values.firstName,
        lastName: values.lastName,
        walletId: values.walletId,
      });
      if (resp?.success) {
        message.success('Profile updated successfully');
        // refresh local user session/context
        const latest = await getUserById(userData._id);
        if (latest?.success && latest.data) {
          setUserData(latest.data);
          const sessionData = {
            user: latest.data,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          login(latest.data);
        }
        setShowEditModal(false);
      } else {
        message.error(resp?.message || 'Update failed');
      }
    } catch (e) {
      // validation or network
      if (e?.errorFields) return; // antd validation
      message.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!userData?._id) return;
    try {
      const values = await pwdForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }
      setPwdSaving(true);
      const resp = await updateUser(userData._id, { password: values.newPassword });
      if (resp?.success) {
        message.success('Password updated successfully');
        pwdForm.resetFields();
        setShowPasswordModal(false);
      } else {
        message.error(resp?.message || 'Password update failed');
      }
    } catch (e) {
      if (e?.errorFields) return;
      message.error('Password update failed');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Space direction="vertical" size="small">
          <Title level={2} className="profile-title">
            Your Profile
          </Title>
          <Text type="secondary" className="profile-subtitle">
            View and manage your account details
          </Text>
        </Space>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        {/* Profile Information Card */}
        <Col xs={24} lg={16}>
          <Card 
            loading={loading} 
            className="profile-info-card"
            title={
              <Space>
                <UserOutlined className="card-icon" />
                <span>Profile Information</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => setShowEditModal(true)}
                className="edit-btn"
              >
                Edit Profile
              </Button>
            }
          >
            <div className="profile-info-grid">
              <div className="info-item">
                <Text type="secondary" className="info-label">Full Name</Text>
                <Text strong className="info-value">
                  {userData ? `${userData.firstName} ${userData.lastName}` : '-'}
                </Text>
              </div>
              <div className="info-item">
                <Text type="secondary" className="info-label">Email Address</Text>
                <Text className="info-value">{userData?.email || '-'}</Text>
              </div>
              <div className="info-item">
                <Text type="secondary" className="info-label">Mobile Number</Text>
                <Text className="info-value">{userData?.mobile || '-'}</Text>
              </div>
              <div className="info-item">
                <Text type="secondary" className="info-label">Wallet Address</Text>
                <Text className="info-value wallet-address">{userData?.walletId || '-'}</Text>
              </div>
              <div className="info-item">
                <Text type="secondary" className="info-label">Referred By</Text>
                <Text className="info-value">{userData?.referredBy || 'No referral'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Referral Code Card */}
        <Col xs={24} lg={8}>
          <Card 
            loading={loading} 
            className="referral-card"
            title={
              <Space>
                <ShareAltOutlined className="card-icon" />
                <span>Referral Code</span>
              </Space>
            }
          >
            <div className="referral-content">
              <div className="referral-code-container">
                <Text code className="referral-code">
                  {userData?.referralCode || '-'}
                </Text>
              </div>
              <Space wrap className="referral-actions">
                <Tooltip title="Copy referral message">
                  <Button 
                    size="small" 
                    icon={<CopyOutlined />} 
                    onClick={() => { 
                      navigator.clipboard.writeText(referralMessage); 
                      message.success('Referral message copied!'); 
                    }}
                    className="action-btn"
                  />
                </Tooltip>
                <Tooltip title="Share via WhatsApp">
                  <Button 
                    size="small" 
                    href={shareLinks.whatsapp} 
                    target="_blank" 
                    rel="noreferrer"
                    className="action-btn"
                  >
                    WhatsApp
                  </Button>
                </Tooltip>
                <Tooltip title="Share on Facebook">
                  <Button 
                    size="small" 
                    href={shareLinks.facebook} 
                    target="_blank" 
                    rel="noreferrer"
                    className="action-btn"
                  >
                    Facebook
                  </Button>
                </Tooltip>
              </Space>
            </div>
          </Card>

          {/* Password Change Card */}
          <Card 
            className="password-card"
            title={
              <Space>
                <LockOutlined className="card-icon" />
                <span>Security</span>
              </Space>
            }
            extra={
              <Button 
                type="default" 
                icon={<LockOutlined />} 
                onClick={() => setShowPasswordModal(true)}
                className="change-password-btn"
              >
                Change Password
              </Button>
            }
          >
            <div className="password-info">
              <Text type="secondary">
                Keep your account secure by regularly updating your password.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined className="modal-icon" />
            <span>Edit Profile</span>
          </Space>
        }
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="edit-profile-modal"
        destroyOnClose
      >
        <Form layout="vertical" form={form} className="edit-form">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item 
                name="firstName" 
                label="First Name" 
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input 
                  placeholder="Enter your first name" 
                  size="large"
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name="lastName" 
                label="Last Name" 
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input 
                  placeholder="Enter your last name" 
                  size="large"
                  className="form-input"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item 
            name="walletId" 
            label="Wallet Address" 
            rules={[{ required: true, message: 'Please enter your wallet address' }]}
          >
            <Input 
              placeholder="Enter your USDT wallet address" 
              size="large"
              className="form-input"
            />
          </Form.Item>
          
          <div className="modal-actions">
            <Button 
              onClick={() => {
                setShowEditModal(false);
                form.resetFields();
              }}
              size="large"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              loading={saving} 
              onClick={handleSave} 
              icon={<SaveOutlined />}
              size="large"
              className="save-btn"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined className="modal-icon" />
            <span>Change Password</span>
          </Space>
        }
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          pwdForm.resetFields();
        }}
        footer={null}
        width={500}
        className="change-password-modal"
        destroyOnClose
      >
        <Form layout="vertical" form={pwdForm} className="password-form">
          <Form.Item 
            name="newPassword" 
            label="New Password" 
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Enter new password" 
              size="large"
              className="form-input"
            />
          </Form.Item>
          <Form.Item 
            name="confirmPassword" 
            label="Confirm Password" 
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm new password" 
              size="large"
              className="form-input"
            />
          </Form.Item>
          
          <div className="modal-actions">
            <Button 
              onClick={() => {
                setShowPasswordModal(false);
                pwdForm.resetFields();
              }}
              size="large"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              loading={pwdSaving} 
              onClick={handlePasswordChange}
              size="large"
              className="save-btn"
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;


