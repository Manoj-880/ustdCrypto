import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Typography, Space, Avatar } from "antd";
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
  HeartOutlined,
  BulbOutlined,
  TrophyOutlined,
  UserOutlined,
  CrownOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import "./WhyJoinPage.css";

const { Title, Paragraph, Text } = Typography;

const WhyJoinPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: <SafetyOutlined />,
      title: "Security First",
      description:
        "Your funds are protected with bank-grade security protocols and multi-layer encryption.",
    },
    {
      icon: <HeartOutlined />,
      title: "Transparency",
      description:
        "Complete transparency in all operations with real-time reporting and open communication.",
    },
    {
      icon: <BulbOutlined />,
      title: "Innovation",
      description:
        "Cutting-edge technology and innovative investment strategies for maximum returns.",
    },
    {
      icon: <TrophyOutlined />,
      title: "Excellence",
      description:
        "Commitment to delivering exceptional results and maintaining the highest standards.",
    },
    {
      icon: <TeamOutlined />,
      title: "Community",
      description:
        "Building a strong community of successful investors who support each other.",
    },
    {
      icon: <RocketOutlined />,
      title: "Growth",
      description:
        "Focused on sustainable growth and long-term success for all our members.",
    },
  ];

  const benefits = [
    {
      icon: <DollarCircleOutlined />,
      title: "High Returns",
      description: "Earn up to 0.75% daily returns on your USDT investments",
    },
    {
      icon: <LockOutlined />,
      title: "Secure Platform",
      description: "Bank-grade security with multi-layer protection",
    },
    {
      icon: <GlobalOutlined />,
      title: "24/7 Access",
      description: "Manage your investments anytime, anywhere in the world",
    },
    {
      icon: <ThunderboltOutlined />,
      title: "Fast Withdrawals",
      description: "Quick and secure withdrawal process",
    },
    {
      icon: <TeamOutlined />,
      title: "Expert Management",
      description: "Managed by experienced financial professionals",
    },
    {
      icon: <RiseOutlined />,
      title: "Compound Growth",
      description: "Watch your investment grow with compound interest",
    },
  ];

  return (
    <div className="why-join-page">
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
            Why Join <span className="gradient-text">SecureUSDT</span>?
          </Title>

          <Paragraph className="hero-description">
            Join thousands of successful investors who have chosen SecureUSDT
            for their USDT investment needs. Discover why we're the trusted
            choice for secure, profitable cryptocurrency investments.
          </Paragraph>

          <Space size="large" className="hero-buttons">
            <Link to="/register">
              <Button type="primary" size="large" className="cta-button">
                Join Our Community
                <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to="/our-plans">
              <Button size="large" className="learn-more-btn">
                View Our Plans
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Why Choose <span className="gradient-text">SecureUSDT</span>?
            </Title>
            <Paragraph className="section-description">
              We provide the most comprehensive and secure USDT investment
              platform with proven results and expert management.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {benefits.map((benefit, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="benefit-card" hoverable>
                  <div className="benefit-icon">{benefit.icon}</div>
                  <Title level={4} className="benefit-title">
                    {benefit.title}
                  </Title>
                  <Paragraph className="benefit-description">
                    {benefit.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Core Values</span>
            </Title>
            <Paragraph className="section-description">
              These fundamental principles guide everything we do and ensure
              your success.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {coreValues.map((value, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="value-card" hoverable>
                  <div className="value-icon">{value.icon}</div>
                  <Title level={4} className="value-title">
                    {value.title}
                  </Title>
                  <Paragraph className="value-description">
                    {value.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>


      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">1200+</div>
                <div className="stat-label">Active Investors</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">$1M+</div>
                <div className="stat-label">Under Management</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">18</div>
                <div className="stat-label">Countries</div>
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
              Ready to Join Our <span className="gradient-text">Community</span>
              ?
            </Title>
            <Paragraph className="cta-description">
              Start your investment journey with SecureUSDT today and experience
              the benefits of professional USDT management.
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

export default WhyJoinPage;
