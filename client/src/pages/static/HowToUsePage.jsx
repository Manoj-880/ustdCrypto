import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Steps, Collapse, Space, Alert, Divider, Spin, Empty, message } from 'antd';
import { 
  ArrowRightOutlined, 
  UserOutlined,
  WalletOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { getAllFAQs } from '../../api_calls/faqApi';
import './HowToUsePage.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const HowToUsePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadFAQs();
  }, []);

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

  const steps = [
    {
      title: 'Create Account',
      description: 'Sign up and verify your account',
      icon: <UserOutlined />,
      content: {
        title: 'Step 1: Create Account',
        description: 'Getting started with SecureUSDT takes only a few minutes. Create your account and gain immediate access to your personalized dashboard.',
        details: [
          'Click the "Get Started" button on our homepage',
          'Fill in your basic information (name, email, password)',
          'Verify your email address through the confirmation link',
          'Complete a simple identity check for security',
          'Gain immediate access to your personalized dashboard'
        ],
        tips: [
          'Use a strong password with at least 8 characters',
          'Keep your login credentials secure and private',
          'The platform\'s onboarding process is fully automated and secure'
        ]
      }
    },
    {
      title: 'Deposit USDT',
      description: 'Add funds to your account',
      icon: <WalletOutlined />,
      content: {
        title: 'Step 2: Deposit USDT',
        description: 'Add USDT to your wallet through a verified blockchain transaction. Choose your preferred lock-in plan and start earning.',
        details: [
          'Navigate to the "Add Funds" section in your dashboard',
          'Copy your unique USDT wallet address',
          'Send USDT from your external wallet to our address',
          'Wait for blockchain confirmation (usually 5-15 minutes)',
          'Choose from 3-day, 30-day, or 100-day lock-in plans'
        ],
        tips: [
          'Always double-check the wallet address before sending',
          'Send only USDT (TRC-20) to avoid loss of funds',
          'Every deposit is recorded on-chain and reflected immediately'
        ]
      }
    },
    {
      title: 'Start Earning',
      description: 'Watch your investment grow',
      icon: <DollarCircleOutlined />,
      content: {
        title: 'Step 3: Start Earning',
        description: 'Your rewards are credited to your wallet balance automatically each day. Monitor your earnings and withdraw available funds at your convenience.',
        details: [
          'Your rewards are credited automatically each day',
          'Monitor your earnings in the dashboard',
          'View historical payouts and performance tracking',
          'Withdraw available funds at your convenience',
          'Your principal is securely released at maturity'
        ],
        tips: [
          'Check your dashboard regularly to track progress',
          'Every withdrawal request passes through blockchain verification',
          'At the end of the lock-in term, your principal amount is securely released'
        ]
      }
    },
  ];



  return (
    <div className="how-to-use-page">
      {/* Hero Section */}
      <section className="how-to-hero">
        <div className="container">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              How to Use <span className="gradient-text">SecureUSDT</span>
            </Title>
            <Paragraph className="hero-description">
              Simple. Secure. Seamless. Get started with SecureUSDT in just three easy steps and begin 
              earning consistent returns on your USDT investments with complete transparency and control.
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Start Now
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="large" className="learn-more-btn">
                  Need Help?
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="quick-start-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Quick <span className="gradient-text">Start Guide</span>
            </Title>
            <Paragraph className="section-description">
              Follow these three simple steps to start earning returns on your USDT investments.
            </Paragraph>
          </div>
          
          <div className="steps-container">
            <Steps
              current={activeStep}
              onChange={setActiveStep}
              items={steps.map(step => ({
                title: step.title,
                description: step.description,
                icon: step.icon
              }))}
              className="custom-steps"
            />
            
            <div className="step-content">
              <Card className="step-card">
                <Title level={3} className="step-content-title">
                  {steps[activeStep].content.title}
                </Title>
                <Paragraph className="step-content-description">
                  {steps[activeStep].content.description}
                </Paragraph>
                
                <div className="step-details">
                  <Title level={4} className="details-title">What you need to do:</Title>
                  <ul className="details-list">
                    {steps[activeStep].content.details.map((detail, index) => (
                      <li key={index} className="detail-item">
                        <CheckCircleOutlined className="check-icon" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="step-tips">
                  <Title level={4} className="tips-title">
                    <InfoCircleOutlined className="info-icon" />
                    Pro Tips:
                  </Title>
                  <ul className="tips-list">
                    {steps[activeStep].content.tips.map((tip, index) => (
                      <li key={index} className="tip-item">
                        <ExclamationCircleOutlined className="tip-icon" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* Important Information Section */}
      <section className="info-section">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              <Alert
                message="Security First"
                description="Your funds are protected with bank-grade security measures including SSL encryption and cold storage."
                type="success"
                icon={<SafetyOutlined />}
                showIcon
                className="info-alert"
              />
            </Col>
            <Col xs={24} lg={8}>
              <Alert
                message="Instant Processing"
                description="Deposits are processed within minutes and withdrawals are completed within 24 hours."
                type="info"
                icon={<ThunderboltOutlined />}
                showIcon
                className="info-alert"
              />
            </Col>
            <Col xs={24} lg={8}>
              <Alert
                message="24/7 Support"
                description="Our customer support team is available around the clock to assist you with any questions."
                type="warning"
                icon={<ClockCircleOutlined />}
                showIcon
                className="info-alert"
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </Title>
            <Paragraph className="section-description">
              Find answers to common questions about using SecureUSDT and managing your investments.
            </Paragraph>
          </div>
          
          <div className="faq-container">
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
              <Collapse
                items={faqs.map((faq, index) => ({
                  key: faq._id || index.toString(),
                  label: (
                    <div className="faq-question">
                      <QuestionCircleOutlined className="faq-icon" />
                      {faq.question}
                    </div>
                  ),
                  children: <Paragraph className="faq-answer">{faq.answer}</Paragraph>
                }))}
                className="custom-collapse"
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Start <span className="gradient-text">Earning</span>?
            </Title>
            <Paragraph className="cta-description">
              Join thousands of investors who are already earning consistent returns on their USDT investments.
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

export default HowToUsePage;
