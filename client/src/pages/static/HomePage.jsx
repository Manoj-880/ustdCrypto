import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
  ArrowRightOutlined,
  SafetyOutlined,
  DollarCircleOutlined,
  GlobalOutlined,
  TeamOutlined,
  RiseOutlined,
  LockOutlined,
  ThunderboltOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.svg";
import "./HomePage.css";

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <SafetyOutlined />,
      title: "Multi-Layer Wallet Protection",
      description:
        "Advanced wallet encryption and tiered verification systems safeguard your USDT at every step.",
    },
    {
      icon: <DollarCircleOutlined />,
      title: "High Returns",
      description:
        "Earn up to 0.5% daily returns on your USDT investments with our proven strategies.",
    },
    {
      icon: <GlobalOutlined />,
      title: "Global Access",
      description:
        "Access your investments from anywhere in the world, 24/7 availability.",
    },
    {
      icon: <TeamOutlined />,
      title: "Expert Team",
      description:
        "Managed by experienced financial professionals with years of market expertise.",
    },
    {
      icon: <LockOutlined />,
      title: "Lock-in Plans",
      description:
        "Flexible investment periods from 3 to 30 days with guaranteed returns.",
    },
    {
      icon: <ThunderboltOutlined />,
      title: "Instant Withdrawals",
      description:
        "Quick and secure withdrawal process with minimal processing time.",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-coins">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`coin coin-${i + 1}`}>
                <img
                  src={logo}
                  alt="SecureUSDT Logo"
                  className="floating-logo"
                />
              </div>
            ))}
          </div>
          <div className="gradient-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <StarOutlined />
            <span>Trusted by 1200+ Investors Worldwide</span>
          </div>

          <Title level={1} className="hero-title">
            Grow Your <span className="gradient-text">USDT</span> with
            <br />
            <span className="gradient-text">Secure</span> Investment Plans
          </Title>

          <Paragraph className="hero-description">
            Join thousands of investors earning up to 0.75% daily returns on
            their USDT investments. Our bank-grade security and expert
            management ensure your funds are safe while generating consistent
            profits.
          </Paragraph>

          <Space size="large" className="hero-buttons">
            <Link to="/register">
              <Button type="primary" size="large" className="cta-button">
                Start Investing Now
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
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Title
              level={2}
              className="section-title"
              style={{ color: "#ffffff !important" }}
            >
              Why Choose <span className="gradient-text">SecureUSDT</span>?
            </Title>
            <Paragraph className="section-description">
              We provide the most secure and profitable USDT investment platform
              with cutting-edge technology and expert management.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
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
              Start earning returns on your USDT in just three simple steps.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <div className="step-card">
                <div className="step-number">1</div>
                <Title level={4} className="step-title">
                  Create Account
                </Title>
                <Paragraph className="step-description">
                  Sign up for free and verify your account in minutes. No
                  complex KYC required.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="step-card">
                <div className="step-number">2</div>
                <Title level={4} className="step-title">
                  Deposit Funds
                </Title>
                <Paragraph className="step-description">
                  Add USDT to your account and start earning returns on your
                  investment.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="step-card">
                <div className="step-number">3</div>
                <Title level={4} className="step-title">
                  Start Earning
                </Title>
                <Paragraph className="step-description">
                  Deposit your USDT and watch your investment grow with daily
                  returns and compound interest.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              About <span className="gradient-text">SecureUSDT</span>
            </Title>
            <Paragraph className="section-description">
              We are a leading cryptocurrency investment platform dedicated to
              providing secure, profitable opportunities for USDT investors
              worldwide.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12}>
              <Card className="about-card">
                <div className="about-content">
                  <div className="about-icon">
                    <SafetyOutlined />
                  </div>
                  <Title level={3} className="about-title">
                    Our Mission
                  </Title>
                  <Paragraph className="about-description">
                    To democratize cryptocurrency investments by providing
                    secure, transparent, and profitable opportunities for
                    investors of all levels. We believe everyone deserves access
                    to high-quality investment services.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="about-card">
                <div className="about-content">
                  <div className="about-icon">
                    <RiseOutlined />
                  </div>
                  <Title level={3} className="about-title">
                    Our Vision
                  </Title>
                  <Paragraph className="about-description">
                    To become the world's most trusted cryptocurrency investment
                    platform, empowering millions of investors to achieve their
                    financial goals through innovative blockchain technology and
                    expert management.
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="impact-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Impact</span>
            </Title>
            <Paragraph className="section-description">
              See the positive impact we're making in the cryptocurrency
              investment space.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={12} sm={6}>
              <div className="impact-stat">
                <div className="stat-number">1200+</div>
                <div className="stat-label">Active Investors</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="impact-stat">
                <div className="stat-number">$1M+</div>
                <div className="stat-label">Assets Management</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="impact-stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Platform Uptime</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="impact-stat">
                <div className="stat-number">18</div>
                <div className="stat-label">Countries</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer Links Section */}
      <section className="footer-links-section">
        <div className="container">
          <Row gutter={[32, 32]} justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <div className="links-content">
                <Title level={3} className="links-title">
                  Important Links
                </Title>
                <div className="links-list">
                  <Link to="/terms" className="footer-link">
                    Terms and Conditions
                  </Link>
                  <Link to="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                  <Link to="/risk-disclaimer" className="footer-link">
                    Risk Disclaimer
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="ready-to-join">
                <Title level={3} className="join-title">
                  Ready to Join Our Community?
                </Title>
                <Paragraph className="join-description">
                  Start your investment journey today and become part of our
                  growing community of successful investors.
                </Paragraph>
                <Link to="/register">
                  <Button type="primary" size="large" className="join-button">
                    Join Now
                    <ArrowRightOutlined />
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Start Your{" "}
              <span className="gradient-text">Investment</span> Journey?
            </Title>
            <Paragraph className="cta-description">
              Join SecureUSDT today and start earning consistent returns on your
              USDT investments. Your financial future starts here.
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

export default HomePage;
