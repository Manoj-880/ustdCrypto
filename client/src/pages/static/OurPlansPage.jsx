import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { 
  ArrowRightOutlined, 
  SafetyOutlined, 
  DollarCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import './OurPlansPage.css';

const { Title, Paragraph, Text } = Typography;

const OurPlansPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const plans = [
    {
      key: '1',
      name: 'Quick Flex Plan',
      period: '3 Days',
      dailyReturn: '0.4%',
      highlights: 'Ideal for short-term users who want fast liquidity and consistent reward cycles.',
      features: ['Fast liquidity', 'Consistent rewards', 'Low risk', 'Quick access'],
      color: '#00d4aa',
      icon: <ThunderboltOutlined />
    },
    {
      key: '2',
      name: 'Smart Growth Plan',
      period: '30 Days',
      dailyReturn: '0.5%',
      highlights: 'Balanced plan for moderate investors — steady daily returns with monthly compounding effect.',
      features: ['Monthly compounding', 'Steady returns', 'Balanced risk', 'Moderate growth'],
      color: '#00a8ff',
      icon: <RocketOutlined />
    },
    {
      key: '3',
      name: 'Premium Lock-in Plan',
      period: '100 Days',
      dailyReturn: '0.75%',
      highlights: 'Designed for long-term holders aiming for higher cumulative rewards and compounding benefits.',
      features: ['Highest returns', 'Long-term growth', 'Maximum compounding', 'Premium benefits'],
      color: '#ff6b6b',
      icon: <CrownOutlined />
    }
  ];


  const features = [
    {
      icon: <SafetyOutlined />,
      title: 'Bank-Grade Security',
      description: 'Your investments are protected with military-grade encryption and multi-layer security protocols.'
    },
    {
      icon: <DollarCircleOutlined />,
      title: 'Guaranteed Returns',
      description: 'Up to 0.75% daily returns with transparent and predictable profit distribution.'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Flexible Terms',
      description: 'Choose from 3-day to 100-day lock-in periods that suit your investment goals.'
    },
    {
      icon: <StarOutlined />,
      title: 'Expert Management',
      description: 'Managed by experienced financial professionals with proven track records.'
    },
    {
      icon: <CheckCircleOutlined />,
      title: 'Transparent Process',
      description: 'Complete transparency in all operations with real-time reporting and updates.'
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'Instant Withdrawals',
      description: 'Quick and secure withdrawal process with minimal processing time.'
    }
  ];

  return (
    <div className="our-plans-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Our <span className="gradient-text">Investment Plans</span>
          </Title>
          
          <Paragraph className="hero-description">
            SecureUSDT offers flexible lock-in plans that fit every investor's goal — whether you're looking for 
            short-term liquidity or long-term compounding growth. Each plan provides up to a defined daily return, 
            credited directly to your wallet with complete transparency and control.
          </Paragraph>
          
          <Space size="large" className="hero-buttons">
            <Link to="/register">
              <Button type="primary" size="large" className="cta-button">
                Start Investing
                <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to="/why-join">
              <Button size="large" className="learn-more-btn">
                Why Choose Us
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Plans Cards Section */}
      <section className="plans-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Choose Your <span className="gradient-text">Investment Plan</span>
            </Title>
            <Paragraph className="section-description">
              Select the plan that best fits your investment goals and risk tolerance.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} justify="center">
            {plans.map((plan, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Card className="plan-card" hoverable>
                  <div className="plan-card-header">
                    <div className="plan-icon-large" style={{ color: plan.color }}>
                      {plan.icon}
                    </div>
                    <Title level={3} className="plan-card-title">{plan.name}</Title>
                    <div className="plan-period-badge">{plan.period}</div>
                  </div>
                  
                  <div className="plan-card-body">
                    <div className="daily-return">
                      <Text className="return-label">Daily Returns (up to)</Text>
                      <Title level={2} className="return-amount" style={{ color: plan.color }}>
                        {plan.dailyReturn}
                      </Title>
                    </div>
                    
                    <Paragraph className="plan-description">{plan.highlights}</Paragraph>
                    
                    <div className="plan-features">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="feature-item">
                          <CheckCircleOutlined style={{ color: plan.color }} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="plan-card-footer">
                    <Link to="/register">
                      <Button 
                        type="primary" 
                        size="large" 
                        className="plan-button"
                        style={{ 
                          background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                          border: 'none'
                        }}
                      >
                        Choose This Plan
                        <ArrowRightOutlined />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Why Our Plans Are <span className="gradient-text">Different</span>
            </Title>
            <Paragraph className="section-description">
              We provide unique advantages that make our investment plans stand out from the competition.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4} className="feature-title">{feature.title}</Title>
                  <Paragraph className="feature-description">{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
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
              Join thousands of successful investors who have chosen SecureUSDT for their USDT investment needs.
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Get Started Now
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="large" className="contact-btn">
                  Contact Us
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPlansPage;
