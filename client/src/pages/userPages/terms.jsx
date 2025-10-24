import React from 'react';
import '../../styles/pages/userPages/terms.css';

const Terms = () => {
    return (
        <div className="terms-page">
            <div className="page-header">
                <h1 className="page-title">Terms & Conditions</h1>
                <p className="last-updated">Last updated: January 2025</p>
            </div>

            <div className="content-container">
                <h2 className="main-title">SecureUSDT – Terms & Conditions (2025 Edition)</h2>
                
                <div className="content-section">
                    <h3 className="section-title">1. Acceptance of Terms</h3>
                    <p className="section-text">
                        By registering, accessing, or using the SecureUSDT platform, you acknowledge that you have read,
                        understood, and agreed to these Terms & Conditions. Continued use of the platform constitutes
                        ongoing acceptance of these terms.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">2. Eligibility</h3>
                    <p className="section-text">To participate in SecureUSDT, users must:</p>
                    <ul className="bullet-list">
                        <li>Be at least 18 years of age.</li>
                        <li>Reside in a jurisdiction where the use of cryptocurrency-based platforms is legally permitted.</li>
                        <li>Provide accurate and verifiable information when required for account verification or compliance purposes.</li>
                    </ul>
                </div>

                <div className="content-section">
                    <h3 className="section-title">3. Deposits</h3>
                    <p className="section-text">
                        All deposits are accepted exclusively in USDT (Tether) via supported blockchain networks.
                        SecureUSDT does not accept fiat currency or any alternative cryptocurrencies. Users must ensure
                        that deposits are made to the correct wallet address displayed in their account.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">4. Lock-In Periods</h3>
                    <p className="section-text">Investment options are available with the following fixed lock-in durations:</p>
                    <ul className="bullet-list">
                        <li>3 Days</li>
                        <li>30 Days</li>
                        <li>100 Days</li>
                    </ul>
                    <p className="section-text">
                        Once initiated, lock-in periods cannot be altered, shortened, or withdrawn prematurely.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">5. Daily Rewards</h3>
                    <p className="section-text">Rewards are distributed daily based on the selected plan:</p>
                    <ul className="bullet-list">
                        <li>0.4% per day — 3-Day Plan</li>
                        <li>0.5% per day — 30-Day Plan</li>
                        <li>0.75% per day — 100-Day Plan</li>
                    </ul>
                    <p className="section-text">
                        All rewards are system-based performance incentives, credited automatically to the user's
                        wallet balance.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">6. Principal Release</h3>
                    <p className="section-text">
                        At the end of the lock-in period, the principal investment amount is automatically released to the
                        user's wallet balance.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">7. Referral Bonus</h3>
                    <p className="section-text">
                        Referral bonuses are credited only when a referred user increases their total active lock-in balance.
                        Re-locking existing funds does not generate additional bonuses. The referral reward structure may
                        be revised at SecureUSDT's discretion.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">8. Withdrawals</h3>
                    <p className="section-text">
                        Users may withdraw daily rewards and referral bonuses at any time, subject to blockchain network
                        confirmations and system availability. Withdrawal timelines may vary depending on network
                        conditions.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">9. User Responsibility</h3>
                    <p className="section-text">Users are fully responsible for:</p>
                    <ul className="bullet-list">
                        <li>Maintaining account confidentiality and wallet security.</li>
                        <li>Ensuring accurate wallet addresses for all deposits and withdrawals.</li>
                        <li>Reporting any suspicious activity immediately to support@secureusdt.com.</li>
                    </ul>
                    <p className="section-text">
                        SecureUSDT is not liable for losses resulting from user negligence or incorrect transaction details.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">10. Risk Acknowledgment</h3>
                    <p className="section-text">
                        Cryptocurrency investments carry inherent market, liquidity, and technological risks.
                        SecureUSDT is not responsible for losses caused by:
                    </p>
                    <ul className="bullet-list">
                        <li>Market fluctuations or volatility.</li>
                        <li>Blockchain delays or technical failures.</li>
                        <li>Third-party service interruptions or cyber incidents.</li>
                    </ul>
                </div>

                <div className="content-section">
                    <h3 className="section-title">11. Misuse & Fraud</h3>
                    <p className="section-text">
                        Any misuse of the platform — including fraudulent transactions, system manipulation, or
                        unauthorized activity — may result in account suspension, termination, and legal action as deemed
                        appropriate.
                    </p>
                </div>

                <div className="content-section">
                    <h3 className="section-title">12. Governing Law</h3>
                    <p className="section-text">
                        These Terms and all activities conducted through the SecureUSDT platform shall be governed by
                        generally accepted international business laws and digital commerce standards.
                        In the event of any dispute, the matter shall be resolved through fair arbitration in accordance with
                        applicable international regulations and best practices for cross-border digital platforms.
                        Users are responsible for ensuring that their participation complies with the legal and regulatory
                        requirements of their respective countries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
