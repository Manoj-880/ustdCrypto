import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Avatar, Space } from 'antd';
import { 
  ArrowRightOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  GlobalOutlined,
  SafetyOutlined,
  DollarCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  BankOutlined,
  LockOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import './AboutPage.css';

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <SafetyOutlined />,
      title: 'Security First',
      description: 'We prioritize the security of your investments above everything else, using bank-grade encryption and multi-layer security protocols.'
    },
    {
      icon: <DollarCircleOutlined />,
      title: 'Transparency',
      description: 'Complete transparency in our operations, fees, and investment strategies. No hidden costs or surprises.'
    },
    {
      icon: <TeamOutlined />,
      title: 'Customer Focus',
      description: 'Our customers are at the heart of everything we do. We continuously improve based on your feedback.'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology and innovative strategies to maximize your returns while minimizing risks.'
    }
  ];

  const stats = [
    { number: '1200+', label: 'Active Users', icon: <TeamOutlined /> },
    { number: '$2.5M+', label: 'Total Volume', icon: <DollarCircleOutlined /> },
    { number: '99.8%', label: 'Success Rate', icon: <TrophyOutlined /> },
    { number: '45', label: 'Countries', icon: <GlobalOutlined /> }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">Trusted by 1200+ Users</span>
            </div>
            <Title level={1} className="hero-title">
              About <span className="gradient-text">SecureUSDT</span>
            </Title>
            <Paragraph className="hero-description">
              SecureUSDT is a next-generation digital platform built to simplify and strengthen USDT-based
              earnings through secure deposits and transparent daily payouts. Designed for both new and
              experienced users, the platform enables individuals to earn consistent returns by locking in their
              USDT for flexible durations — all while maintaining complete visibility and control.
            </Paragraph>
            <div className="hero-buttons">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Join Our Community
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="large" className="learn-more-btn">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-header">
            <Title level={2} className="stats-title">
              Our <span className="gradient-text">Impact</span>
            </Title>
            <Paragraph className="stats-description">
              Numbers that speak to our commitment and success
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="stat-card" hoverable>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Mission</span>
            </Title>
            <Paragraph className="section-description">
              What sets SecureUSDT apart is its foundation of reliability and trust
            </Paragraph>
          </div>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="mission-content">
                <Paragraph className="mission-description">
                  The platform is powered by multi-layer wallet encryption, AI-based transaction monitoring, and blockchain transparency,
                  ensuring that every transaction is safe, verifiable, and seamless. Users can deposit, track, and
                  withdraw their earnings anytime with full confidence in system integrity.
                </Paragraph>
                <div className="mission-points">
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Multi-layer wallet encryption for maximum security</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>AI-based transaction monitoring</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Blockchain transparency for all transactions</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Daily crediting structure with fair referral program</Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="mission-visual">
                <div className="visual-card">
                  <div className="visual-icon">
                    <SafetyOutlined />
                  </div>
                  <Title level={3} className="visual-title">Multi-Layer Wallet Protection</Title>
                  <Paragraph className="visual-description">
                    Advanced wallet encryption and tiered verification systems safeguard your USDT at every step.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Vision</span>
            </Title>
            <Paragraph className="section-description">
              Building a sustainable digital ecosystem for the future
            </Paragraph>
          </div>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="vision-visual">
                <div className="visual-card">
                  <div className="visual-icon">
                    <ThunderboltOutlined />
                  </div>
                  <Title level={3} className="visual-title">Digital Ecosystem</Title>
                  <Paragraph className="visual-description">
                    Building a sustainable digital ecosystem where users experience growth, transparency, and empowerment.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="vision-content">
                <Paragraph className="vision-description">
                  SecureUSDT is not just about returns — it's about building a sustainable digital ecosystem where
                  users experience growth, transparency, and empowerment. With a simple interface, daily crediting
                  structure, and a fair referral program that rewards genuine participation, SecureUSDT combines the
                  best of technology and financial accessibility.
                </Paragraph>
                <Paragraph className="vision-description">
                  Our mission is to create a smarter, safer, and more rewarding digital investment experience —
                  enabling users to earn, manage, and grow their USDT effortlessly in a transparent and secure
                  environment.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-join-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Why Join <span className="gradient-text">SecureUSDT</span>?
            </Title>
            <Paragraph className="section-description">
              Discover the key benefits that make SecureUSDT the preferred choice for USDT investment
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Card className="benefit-card" hoverable>
                <div className="benefit-icon">
                  <DollarCircleOutlined />
                </div>
                <Title level={4} className="benefit-title">Consistent Daily Rewards</Title>
                <Paragraph className="benefit-description">
                  SecureUSDT provides a unique way to grow your digital assets through structured daily returns. 
                  With automated reward distribution, users can earn up to 0.75% per day on their active lock-ins, 
                  depending on the chosen duration.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="benefit-card" hoverable>
                <div className="benefit-icon">
                  <SafetyOutlined />
                </div>
                <Title level={4} className="benefit-title">Secure Growth with Full Transparency</Title>
                <Paragraph className="benefit-description">
                  Your USDT is protected through multi-layer wallet encryption, blockchain-based verification, 
                  and 24×7 system monitoring. SecureUSDT emphasizes capital protection and user trust.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="benefit-card" hoverable>
                <div className="benefit-icon">
                  <LockOutlined />
                </div>
                <Title level={4} className="benefit-title">Flexible Lock-In Choices</Title>
                <Paragraph className="benefit-description">
                  Whether you're looking for quick compounding or steady long-term gains, SecureUSDT offers 
                  flexible lock-ins — 3-day, 30-day, and 100-day plans. You select the period, the system 
                  manages the returns.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="benefit-card" hoverable>
                <div className="benefit-icon">
                  <TeamOutlined />
                </div>
                <Title level={4} className="benefit-title">Transparent Referral Rewards</Title>
                <Paragraph className="benefit-description">
                  SecureUSDT's referral system is designed for fairness and sustainability. You earn 10% of 
                  your referral's daily earnings — not deposits — ensuring bonuses are tied directly to genuine 
                  platform performance.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={24}>
              <Card className="benefit-card benefit-card-wide" hoverable>
                <div className="benefit-icon">
                  <GlobalOutlined />
                </div>
                <Title level={4} className="benefit-title">Global Access, Anytime</Title>
                <Paragraph className="benefit-description">
                  With SecureUSDT, your portfolio moves with you. The platform supports multi-device access, 
                  real-time wallet syncing, and instant withdrawals — so you can track your investments or 
                  withdraw your rewards from anywhere in the world, 24/7.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Core Values</span>
            </Title>
            <Paragraph className="section-description">
              These values guide everything we do and shape our commitment to our investors.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="value-card" hoverable>
                  <div className="value-icon">{value.icon}</div>
                  <Title level={4} className="value-title">{value.title}</Title>
                  <Paragraph className="value-description">{value.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              How It <span className="gradient-text">Works</span>
            </Title>
            <Paragraph className="section-description">
              Simple. Secure. Seamless. Get started in just three easy steps
            </Paragraph>
          </div>
          
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={8}>
              <Card className="step-card" hoverable>
                <div className="step-number">1</div>
                <div className="step-icon">
                  <CheckCircleOutlined />
                </div>
                <Title level={3} className="step-title">Sign Up & Activate</Title>
                <Paragraph className="step-description">
                  Create your account using your verified email address, complete a simple identity check, 
                  and gain immediate access to your personalized dashboard. Your SecureUSDT wallet is 
                  created instantly, ready for deposits and earnings.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="step-card" hoverable>
                <div className="step-number">2</div>
                <div className="step-icon">
                  <LockOutlined />
                </div>
                <Title level={3} className="step-title">Deposit & Select Plan</Title>
                <Paragraph className="step-description">
                  Add USDT to your wallet through a verified blockchain transaction. Choose from three 
                  flexible plans — 3-day, 30-day, or 100-day lock-ins — depending on your preferred 
                  duration and target returns.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="step-card" hoverable>
                <div className="step-number">3</div>
                <div className="step-icon">
                  <DollarCircleOutlined />
                </div>
                <Title level={3} className="step-title">Earn Daily & Withdraw</Title>
                <Paragraph className="step-description">
                  Your rewards are credited automatically each day. Monitor your earnings, view historical 
                  payouts, and withdraw available funds at your convenience. Your principal is securely 
                  released at maturity.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Join Our <span className="gradient-text">Community</span>?
            </Title>
            <Paragraph className="cta-description">
              Become part of the SecureUSDT family and start your journey towards financial growth today.
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Get Started Now
                  <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button size="large" className="learn-more-btn">
                  Learn How It Works
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
