import React from 'react';
import '../../styles/pages/userPages/privacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-page">
            <div className="page-header">
                <h1 className="page-title">Privacy Policy</h1>
                <p className="last-updated">Last updated: January 2025</p>
            </div>

            <div className="content-container">
                <h2 className="main-title">SecureUSDT – Privacy Policy (2025 Edition)</h2>
                
                <p className="intro-text">
                    At SecureUSDT, we value your trust and are committed to safeguarding your personal and financial
                    information. This Privacy Policy explains how we collect, use, and protect your data while
                    maintaining full transparency and compliance with international standards.
                </p>

                <div className="content-section">
                    <h3 className="section-title">1. Data Collection</h3>
                    <p className="section-text">
                        We collect minimal user information such as your name, email address, and wallet address solely for
                        account registration, verification, and operational purposes.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">2. Transaction Records</h3>
                    <p className="section-text">
                        All deposits, lock-ins, withdrawals, and referral activities are securely recorded in our system to
                        ensure accuracy, transparency, and accountability in every transaction.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">3. Use of Data</h3>
                    <p className="section-text">Your personal data is used exclusively for:</p>
                    <ul className="bullet-list">
                        <li>Account verification and authentication</li>
                        <li>Processing deposits, withdrawals, and rewards</li>
                        <li>Customer support and communication</li>
                        <li>Security alerts and service updates</li>
                    </ul>
                    <p className="section-text">
                        We never use your data beyond these intended purposes.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">4. Confidentiality</h3>
                    <p className="section-text">
                        SecureUSDT maintains strict confidentiality protocols. We do not sell, rent, or share user data with
                        any third party for marketing, profit, or advertising purposes.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">5. Email Communication</h3>
                    <p className="section-text">We may contact you via email for essential communications such as:</p>
                    <ul className="bullet-list">
                        <li>Transaction confirmations</li>
                        <li>Account notifications and updates</li>
                        <li>Security alerts and verification requests</li>
                        <li>Optional newsletters and feature announcements</li>
                    </ul>
                    <p className="section-text">
                        Users may unsubscribe from non-essential updates anytime.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">6. Wallet Security</h3>
                    <p className="section-text">
                        Wallet addresses and transaction logs are encrypted using advanced cryptographic standards and
                        stored in secure servers, ensuring protection from unauthorized access or manipulation.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">7. Data Storage</h3>
                    <p className="section-text">
                        All personal and transactional data is stored on protected servers with restricted access, 24/7
                        monitoring, and automated security checks.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">8. Third-Party Services</h3>
                    <p className="section-text">
                        We may share limited data with trusted service providers (such as payment gateways or analytics
                        partners) strictly for operational, technical, or regulatory purposes. These partners are bound by
                        confidentiality and data protection agreements.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">9. Cookies</h3>
                    <p className="section-text">
                        Our website uses cookies to enhance usability, personalize your experience, and analyze
                        performance metrics. You may manage or disable cookies through your browser settings.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">10. User Rights</h3>
                    <p className="section-text">
                        You may request the closure of your account or deletion of your personal data at any time by
                        contacting our support team at support@secureusdt.com.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">11. Compliance</h3>
                    <p className="section-text">
                        SecureUSDT adheres to applicable data protection laws, including GDPR and international privacy
                        frameworks, ensuring transparency, integrity, and user control over data.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">12. Breach Notification</h3>
                    <p className="section-text">
                        In the unlikely event of a data breach, affected users will be promptly notified, and immediate
                        remedial actions will be taken to secure all affected systems and data.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">Contact Information</h3>
                    <p className="section-text">
                        For any privacy-related queries, contact us at:
                        <br />
                        <strong>support@secureusdt.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
