import React, { useState, useEffect } from 'react';
import {
    Card,
    Collapse,
    Typography,
    Empty,
    Spin,
    message,
    Button,
    Modal,
    Form,
    Input,
    Space
} from 'antd';
import {
    QuestionCircleOutlined,
    SendOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { getAllFAQs } from '../../api_calls/faqApi';
import { submitContactForm } from '../../api_calls/contactApi';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/userPages/faq.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [contactForm] = Form.useForm();
    const [contactLoading, setContactLoading] = useState(false);
    const { user } = useAuth();

    // Load FAQs on component mount
    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setLoading(true);
        try {
            const response = await getAllFAQs();
            if (response.success) {
                setFaqs(response.data);
            } else {
                message.error(response.message || 'Failed to load FAQs');
            }
        } catch (error) {
            console.error('Error loading FAQs:', error);
            message.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    const handleContactSupport = () => {
        // Pre-fill form with user data
        contactForm.setFieldsValue({
            name: user?.name || user?.firstName || '',
            email: user?.email || '',
            mobileNumber: user?.mobileNumber || user?.phone || ''
        });
        setContactModalVisible(true);
    };

    const handleContactSubmit = async (values) => {
        setContactLoading(true);
        try {
            const response = await submitContactForm({
                ...values,
                turnstileToken: 'bypass' // For user pages, we can bypass turnstile
            });
            
            if (response.success) {
                message.success('Your message has been sent successfully! We will get back to you within 24 hours.');
                setContactModalVisible(false);
                contactForm.resetFields();
            } else {
                message.error(response.message || 'Failed to send your message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            message.error('Failed to send your message. Please try again.');
        } finally {
            setContactLoading(false);
        }
    };

    const handleContactCancel = () => {
        setContactModalVisible(false);
        contactForm.resetFields();
    };



    return (
        <div className="faq-page">
            <div className="faq-header">
                <Title level={2}>
                    <QuestionCircleOutlined /> Frequently Asked Questions
                </Title>
                <Text type="secondary">
                    Find answers to common questions about our platform
                </Text>
            </div>


            <div className="faq-content">
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                        <Text>Loading FAQs...</Text>
                    </div>
                ) : faqs.length === 0 ? (
                    <Empty
                        description="No FAQs found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Collapse
                        accordion
                        expandIconPosition="right"
                        className="faq-collapse"
                    >
                        {faqs.map((faq, index) => (
                            <Panel
                                key={faq._id}
                                header={
                                    <div className="faq-header-content">
                                        <div className="faq-question">
                                            <Text strong>{faq.question}</Text>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="faq-answer">
                                    <Text>{faq.answer}</Text>
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </div>

            <div className="faq-help">
                <div className="help-content">
                    <Title level={3} className="help-title">
                        Still need help?
                    </Title>
                    <Text className="help-description">
                        Can't find what you're looking for? Our support team is here to help.
                    </Text>
                    <Button 
                        type="primary" 
                        size="large" 
                        className="help-button"
                        onClick={handleContactSupport}
                        icon={<SendOutlined />}
                    >
                        Contact Support
                    </Button>
                </div>
            </div>

            {/* Contact Support Modal */}
            <Modal
                title={
                    <Space>
                        <SendOutlined style={{ color: '#00d4aa' }} />
                        <span>Contact Support</span>
                    </Space>
                }
                open={contactModalVisible}
                onCancel={handleContactCancel}
                footer={null}
                width={600}
                className="contact-support-modal"
                destroyOnClose
            >
                <div className="contact-modal-content">
                    <div className="contact-info">
                        <Text type="secondary">
                            Need help? Send us a message and we'll get back to you within 24 hours.
                        </Text>
                    </div>

                    <Form
                        form={contactForm}
                        layout="vertical"
                        onFinish={handleContactSubmit}
                        className="contact-form"
                    >
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                                { required: true, message: 'Please enter your full name' },
                                { min: 2, message: 'Name must be at least 2 characters' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your full name"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter your email address"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="mobileNumber"
                            label="Mobile Number"
                            rules={[
                                { required: true, message: 'Please enter your mobile number' },
                                { pattern: /^[+]?[\d\s\-\(\)]+$/, message: 'Please enter a valid mobile number' }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter your mobile number"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                { required: true, message: 'Please enter a subject' },
                                { min: 5, message: 'Subject must be at least 5 characters' }
                            ]}
                        >
                            <Input
                                prefix={<FileTextOutlined />}
                                placeholder="What is this about?"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="message"
                            label="Message"
                            rules={[
                                { required: true, message: 'Please enter your message' },
                                { min: 10, message: 'Message must be at least 10 characters' }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Describe your issue or question in detail..."
                                rows={4}
                                size="large"
                                showCount
                                maxLength={1000}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button
                                    onClick={handleContactCancel}
                                    size="large"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={contactLoading}
                                    icon={<SendOutlined />}
                                >
                                    Send Message
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default FAQ;
