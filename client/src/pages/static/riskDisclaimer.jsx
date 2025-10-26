import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import '../../styles/pages/static/riskDisclaimer.css';

const { Title, Paragraph, Text } = Typography;

const RiskDisclaimer = () => {
  return (
    <div className="risk-disclaimer-page">
      <div className="risk-disclaimer-header">
        <Title level={1} className="risk-disclaimer-title">
          <ExclamationCircleOutlined /> Risk Disclaimer
        </Title>
        <Text type="secondary" className="risk-disclaimer-subtitle">
          Important information about risks associated with cryptocurrency investments
        </Text>
      </div>

      <Card className="risk-disclaimer-card">
        <div className="disclaimer-intro">
          <Paragraph className="intro-text">
            At <Text strong>SecureUSDT</Text>, we prioritize transparency and user awareness. This Risk Disclaimer outlines
            potential risks associated with cryptocurrency-based participation and investment through our
            platform. By using SecureUSDT, you acknowledge and accept the risks described below.
          </Paragraph>
        </div>

        <Divider />

        <div className="disclaimer-sections">
          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 1. Market Risks
            </Title>
            <Paragraph>
              All cryptocurrency investments, including those involving USDT, carry inherent risks due to market
              volatility, liquidity shifts, and global economic factors. Prices can fluctuate significantly within short
              periods, impacting potential returns.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 2. No Guaranteed Returns
            </Title>
            <Paragraph>
              While SecureUSDT provides performance-based daily reward structures as part of its plans, these do
              not represent financial guarantees or fixed income assurances. All rewards depend on system
              performance and platform stability.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 3. Capital Protection
            </Title>
            <Paragraph>
              SecureUSDT aims to return your principal amount after the lock-in period. However, unforeseen
              circumstances — such as market disruptions, technical failures, or external factors — may affect the
              timing or ability to process withdrawals.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 4. Regulatory Risk
            </Title>
            <Paragraph>
              Cryptocurrency regulations differ across jurisdictions. It is the user's responsibility to ensure that
              accessing or participating in SecureUSDT is lawful in their country of residence.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 5. Technology Risk
            </Title>
            <Paragraph>
              SecureUSDT relies on third-party blockchain networks, wallet systems, and digital infrastructures.
              Network congestion, system errors, cyber-attacks, or service interruptions could cause delays or
              impact transactions.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 6. Third-Party Risks
            </Title>
            <Paragraph>
              Certain operations may involve external service providers such as payment gateways, blockchain
              APIs, or data processors. SecureUSDT is not responsible for downtime, technical issues, or losses
              caused by third-party system failures.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 7. No Financial Advice
            </Title>
            <Paragraph>
              SecureUSDT does not provide investment, financial, or trading advice. All users should conduct
              independent research or consult a licensed advisor before participating.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 8. Past Performance
            </Title>
            <Paragraph>
              Any historical results, examples, or previous payout data are provided for illustration only and
              should not be interpreted as an indication or guarantee of future results.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 9. User Responsibility
            </Title>
            <Paragraph>
              Users are fully responsible for safeguarding their account credentials, wallet access keys, and
              passwords. SecureUSDT cannot be held liable for losses resulting from user negligence or
              compromised security practices.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 10. Referral Program
            </Title>
            <Paragraph>
              Referral bonuses are offered as promotional incentives based on referral performance and may be
              modified, suspended, or discontinued at SecureUSDT's discretion without prior notice.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 11. Platform Amendments
            </Title>
            <Paragraph>
              SecureUSDT reserves the right to modify lock-in durations, return percentages, policies, or
              operational structures. Users will be notified in advance of any significant changes through official
              communication channels.
            </Paragraph>
          </div>

          <div className="disclaimer-section">
            <Title level={3} className="section-title">
              <WarningOutlined /> 12. Acknowledgment
            </Title>
            <Paragraph>
              By registering and using SecureUSDT, you confirm that you have read, understood, and accepted all
              associated risks. You agree to participate voluntarily and assume full responsibility for your
              investment decisions.
            </Paragraph>
          </div>
        </div>

        <Divider />

        <div className="disclaimer-footer">
          <Card className="acknowledgment-card">
            <div className="acknowledgment-content">
              <ExclamationCircleOutlined className="acknowledgment-icon" />
              <div className="acknowledgment-text">
                <Title level={4} className="acknowledgment-title">
                  Important Notice
                </Title>
                <Paragraph className="acknowledgment-description">
                  This Risk Disclaimer is an integral part of our Terms of Service. By continuing to use SecureUSDT,
                  you acknowledge that you have read, understood, and agree to be bound by all terms and conditions
                  outlined in this document.
                </Paragraph>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default RiskDisclaimer;
