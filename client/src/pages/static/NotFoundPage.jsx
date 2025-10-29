import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Space } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import "./NotFoundPage.css";

const { Title, Paragraph, Text } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="not-found-page">
      {/* Background Elements */}
      <div className="not-found-background">
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="not-found-container">
        <div className="not-found-content">
          {/* Icon */}
          <div className="not-found-icon">
            <FrownOutlined />
          </div>

          {/* Error Code */}
          <Title level={1} className="error-code">
            404
          </Title>

          {/* Error Message */}
          <Title level={2} className="error-title">
            Page <span className="gradient-text">Not Found</span>
          </Title>

          <Paragraph className="error-description">
            Oops! The page you're looking for doesn't exist or has been moved.
            <br />
            Don't worry, let's get you back on track.
          </Paragraph>

          {/* Action Buttons */}
          <Space size="large" className="not-found-actions">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              className="cta-button primary-button"
            >
              Go Home
            </Button>

            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="secondary-button"
            >
              Go Back
            </Button>
          </Space>

          {/* Quick Links */}
          <div className="quick-links">
            <Text className="quick-links-label">Quick Links:</Text>
            <Space size="middle">
              <Link to="/" className="quick-link">
                Home
              </Link>
              <Link to="/our-plans" className="quick-link">
                Our Plans
              </Link>
              <Link to="/how-to-use" className="quick-link">
                How to Use
              </Link>
              <Link to="/contact" className="quick-link">
                Contact
              </Link>
            </Space>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="not-found-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

