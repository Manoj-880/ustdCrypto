import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Timeline, Avatar, Space } from 'antd';
import { 
  ArrowRightOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  GlobalOutlined,
  SafetyOutlined,
  DollarCircleOutlined,
  RocketOutlined,
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

  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      avatar: 'AJ',
      description: 'Former Goldman Sachs executive with 15+ years in financial markets and blockchain technology.',
      experience: '15+ Years'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      avatar: 'SC',
      description: 'Blockchain security expert and former lead developer at Coinbase with expertise in DeFi protocols.',
      experience: '12+ Years'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Risk Management',
      avatar: 'MR',
      description: 'Quantitative analyst with extensive experience in risk assessment and portfolio optimization.',
      experience: '10+ Years'
    },
    {
      name: 'Emily Watson',
      role: 'Head of Operations',
      avatar: 'EW',
      description: 'Operations specialist with a background in fintech and customer experience optimization.',
      experience: '8+ Years'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'SecureUSDT was established with a vision to democratize USDT investments.',
      icon: <RocketOutlined />
    },
    {
      year: '2021',
      title: 'First 1000 Users',
      description: 'Reached our first milestone of 1000 active investors on the platform.',
      icon: <TeamOutlined />
    },
    {
      year: '2022',
      title: 'Security Certification',
      description: 'Achieved ISO 27001 certification for information security management.',
      icon: <SafetyOutlined />
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded operations to 45 countries with multi-language support.',
      icon: <GlobalOutlined />
    },
    {
      year: '2024',
      title: 'Market Leadership',
      description: 'Became the leading USDT investment platform with 99.8% success rate.',
      icon: <TrophyOutlined />
    }
  ];

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
    { number: '12,500+', label: 'Active Investors', icon: <TeamOutlined /> },
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
            <Title level={1} className="hero-title">
              About <span className="gradient-text">SecureUSDT</span>
            </Title>
            <Paragraph className="hero-description">
              We are a leading USDT investment platform dedicated to providing secure, 
              transparent, and profitable investment opportunities for individuals worldwide. 
              Our mission is to democratize access to high-yield USDT investments while 
              maintaining the highest standards of security and customer service.
            </Paragraph>
            <Space size="large">
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
            </Space>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
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
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="mission-content">
                <Title level={2} className="section-title">
                  Our <span className="gradient-text">Mission</span>
                </Title>
                <Paragraph className="mission-description">
                  To provide secure, transparent, and profitable USDT investment opportunities 
                  that empower individuals to grow their wealth while maintaining the highest 
                  standards of security and customer service.
                </Paragraph>
                <div className="mission-points">
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Bank-grade security for all investments</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Transparent fee structure and operations</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>Expert team with proven track record</Text>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <Text>24/7 customer support and assistance</Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="mission-visual">
                <div className="visual-card">
                  <div className="visual-icon">
                    <BankOutlined />
                  </div>
                  <Title level={3} className="visual-title">Secure Banking</Title>
                  <Paragraph className="visual-description">
                    Your funds are protected with the same security standards used by major banks worldwide.
                  </Paragraph>
                </div>
              </div>
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

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Meet Our <span className="gradient-text">Expert Team</span>
            </Title>
            <Paragraph className="section-description">
              Our team consists of experienced professionals from top financial institutions and blockchain companies.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="team-card" hoverable>
                  <div className="team-avatar">
                    <Avatar size={80} className="member-avatar">
                      {member.avatar}
                    </Avatar>
                    <div className="experience-badge">{member.experience}</div>
                  </div>
                  <Title level={4} className="member-name">{member.name}</Title>
                  <Text className="member-role">{member.role}</Text>
                  <Paragraph className="member-description">{member.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Our <span className="gradient-text">Journey</span>
            </Title>
            <Paragraph className="section-description">
              From startup to market leader, here's how we've grown and evolved over the years.
            </Paragraph>
          </div>
          
          <div className="timeline-container">
            <Timeline
              items={milestones.map((milestone, index) => ({
                dot: (
                  <div className="timeline-dot">
                    {milestone.icon}
                  </div>
                ),
                children: (
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <Title level={4} className="timeline-title">{milestone.title}</Title>
                    <Paragraph className="timeline-description">{milestone.description}</Paragraph>
                  </div>
                )
              }))}
            />
          </div>
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
