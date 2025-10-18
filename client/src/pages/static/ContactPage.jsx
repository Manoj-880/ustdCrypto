import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Form, Input, message, Space, Spin, Empty } from 'antd';
import { 
  ArrowRightOutlined, 
  MailOutlined,
  SendOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { getAllFAQs } from '../../api_calls/faqApi';
import { submitContactForm } from '../../api_calls/contactApi';
import './ContactPage.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadFAQs();
    loadTurnstile();
  }, []);

  const loadTurnstile = () => {
    // Load Cloudflare Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTurnstileLoaded(true);
      // Set up global callbacks
      window.onTurnstileSuccess = (token) => {
        setTurnstileToken(token);
      };
      window.onTurnstileError = () => {
        setTurnstileToken(null);
        message.error('Please complete the security verification');
      };
      window.onTurnstileExpired = () => {
        setTurnstileToken(null);
        message.warning('Security verification expired. Please try again.');
      };
    };
    document.head.appendChild(script);
  };

  const loadFAQs = async () => {
    setFaqLoading(true);
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
      setFaqLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MailOutlined />,
      title: 'Support',
      description: 'Get help with your account and general inquiries',
      details: 'support@secureusdt.com',
      action: 'Send Email',
      color: '#00d4aa',
      responseTime: '2-4 hours during business hours'
    },
    {
      icon: <MailOutlined />,
      title: 'Administration',
      description: 'For administrative matters and account management',
      details: 'admin@secureusdt.com',
      action: 'Send Email',
      color: '#00a8ff',
      responseTime: '4-8 hours during business hours'
    }
  ];



  const handleSubmit = async (values) => {
    // Check if Turnstile token is present
    if (!turnstileToken) {
      message.error('Please complete the security verification');
      return;
    }

    setLoading(true);
    try {
      const response = await submitContactForm({
        ...values,
        turnstileToken
      });
      
      if (response.success) {
        message.success(response.message || 'Your message has been sent successfully! We will get back to you within 24 hours.');
        form.resetFields();
        setTurnstileToken(null);
        // Reset Turnstile widget
        if (window.turnstile) {
          window.turnstile.reset();
        }
      } else {
        message.error(response.message || 'Failed to send message. Please try again.');
        // Reset Turnstile on error
        if (window.turnstile) {
          window.turnstile.reset();
        }
        setTurnstileToken(null);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      message.error('Failed to send message. Please try again.');
      // Reset Turnstile on error
      if (window.turnstile) {
        window.turnstile.reset();
      }
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Contact <span className="gradient-text">SecureUSDT</span>
            </Title>
            <Paragraph className="hero-description">
              We're here to help! Get in touch with our support team for any questions, 
              concerns, or assistance you may need. We're committed to providing excellent customer service.
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Get Started
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button size="large" className="learn-more-btn">
                  How It Works
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="contact-methods-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <span className="title-text">Get in </span>
              <span className="gradient-text">Touch</span>
            </Title>
            <Paragraph className="section-description">
              We provide comprehensive email support for all your needs. Choose the appropriate email address for your inquiry type.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} justify="center">
            {contactInfo.map((info, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="contact-card" hoverable>
                  <div className="contact-icon" style={{ color: info.color }}>
                    {info.icon}
                  </div>
                  <Title level={4} className="contact-title">{info.title}</Title>
                  <Paragraph className="contact-description">{info.description}</Paragraph>
                  <Text className="contact-details">{info.details}</Text>
                  <Text className="response-time" type="secondary">
                    <ClockCircleOutlined /> {info.responseTime}
                  </Text>
                  <Button 
                    type="primary" 
                    className="contact-action-btn"
                    style={{ background: info.color, borderColor: info.color }}
                    block
                  >
                    {info.action}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <Row justify="center">
            <Col xs={24} lg={16}>
              <div className="form-content">
                <Title level={2} className="form-title">
                  Send us a <span className="gradient-text">Message</span>
                </Title>
                <Paragraph className="form-description">
                  Fill out the form below and we'll get back to you as soon as possible. 
                  All fields are required to ensure we can provide you with the best assistance.
                </Paragraph>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="contact-form"
                >
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined className="input-icon" />} 
                      placeholder="Enter your full name"
                      className="form-input"
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
                      prefix={<MailOutlined className="input-icon" />} 
                      placeholder="Enter your email address"
                      className="form-input"
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
                      prefix={<PhoneOutlined className="input-icon" />} 
                      placeholder="Enter your mobile number"
                      className="form-input"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: 'Please enter a subject' }]}
                  >
                    <Input 
                      prefix={<FileTextOutlined className="input-icon" />} 
                      placeholder="What is this about?"
                      className="form-input"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Please describe your inquiry in detail..."
                      className="form-input"
                      size="large"
                    />
                  </Form.Item>

                  {/* Cloudflare Turnstile */}
                  <Form.Item
                    label="Security Verification"
                    required
                  >
                    <div className="turnstile-container">
                      {turnstileLoaded && (
                        <div
                          className="cf-turnstile"
                          data-sitekey="0x4AAAAAAB7RJC2IsQAMNbh6"
                          data-callback="onTurnstileSuccess"
                          data-error-callback="onTurnstileError"
                          data-expired-callback="onTurnstileExpired"
                          data-theme="light"
                          data-size="normal"
                        />
                      )}
                      {!turnstileLoaded && (
                        <div className="turnstile-loading">
                          <Spin size="small" /> Loading security verification...
                        </div>
                      )}
                    </div>
                  </Form.Item>
                  
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="submit-btn"
                      icon={<SendOutlined />}
                      disabled={!turnstileToken}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
            
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Contact <span className="gradient-text">FAQ</span>
            </Title>
            <Paragraph className="section-description">
              Find quick answers to common questions about contacting our support team.
            </Paragraph>
          </div>
          
          {faqLoading ? (
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
            <Row gutter={[32, 32]}>
              {faqs.map((faq, index) => (
                <Col xs={24} md={12} key={faq._id || index}>
                  <Card className="faq-card" hoverable>
                    <Title level={4} className="faq-question">{faq.question}</Title>
                    <Paragraph className="faq-answer">{faq.answer}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Start Your <span className="gradient-text">Investment</span> Journey?
            </Title>
            <Paragraph className="cta-description">
              Join thousands of satisfied investors who trust SecureUSDT with their USDT investments. 
              Start earning returns today!
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Get Started Now
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="large" className="learn-more-btn">
                  Learn More About Us
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
