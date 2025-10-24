const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Configure AWS SES
const createSESClient = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
  }
  
  return new SESClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
};

// Email templates
const emailTemplates = {
  // 1. Welcome Email
  welcomeEmail: (userName, userEmail) => {
    return {
      subject: "Welcome to SecureUSDT – Your Account is Ready!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SecureUSDT</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .welcome-title { font-size: 28px; margin: 20px 0; }
            .features { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .feature-item { margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔒 SecureUSDT</div>
              <h1 class="welcome-title">Welcome to SecureUSDT!</h1>
              <p>Your secure cryptocurrency investment journey begins now</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Welcome to SecureUSDT, the most secure and profitable cryptocurrency investment platform. Your account has been successfully created and is ready to use.</p>
              
              <div class="features">
                <h3>🚀 What you can do now:</h3>
                <div class="feature-item">💰 <strong>Invest in USDT</strong> - Start with our secure lock-in plans</div>
                <div class="feature-item">📊 <strong>Track Profits</strong> - Monitor your investment growth in real-time</div>
                <div class="feature-item">🔒 <strong>Secure Withdrawals</strong> - Withdraw your profits safely and quickly</div>
                <div class="feature-item">📱 <strong>Mobile Friendly</strong> - Access your account from anywhere</div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/login" class="cta-button">Login Now</a>
              </div>
              
              <p>If you have any questions, feel free to contact our support team. We're here to help you succeed!</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to SecureUSDT!
        
        Hello ${userName},
        
        Welcome to SecureUSDT, the most secure and profitable cryptocurrency investment platform. Your account has been successfully created and is ready to use.
        
        What you can do now:
        - Invest in USDT with our secure lock-in plans
        - Track your profits in real-time
        - Withdraw your earnings safely
        - Access your account from anywhere
        
        Login now: https://secureusdt.com/login
        
        If you have any questions, contact our support team.
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  // 2. Deposit Success Email
  depositSuccess: (userName, userEmail, amount, planName, startDate, maturityDate, txId) => {
    return {
      subject: "Deposit Confirmed – Your Lock-In Has Started",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Deposit Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .transaction-details { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 150px; }
            .detail-value { color: #333; flex: 1; text-align: right; }
            .amount { font-size: 24px; font-weight: bold; color: #00d4aa; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Deposit Confirmed!</h1>
              <p>Your lock-in investment has started successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Great news! Your USDT deposit has been successfully processed and your lock-in investment has started.</p>
              
              <div class="transaction-details">
                <h3>📊 Investment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value amount">${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Plan:</span>
                  <span class="detail-value">${planName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Maturity Date:</span>
                  <span class="detail-value">${maturityDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${txId}</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/dashboard" class="cta-button">View Dashboard</a>
              </div>
              
              <p>You can track your investment progress and profits in your dashboard. We'll notify you when your investment matures.</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated confirmation email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Deposit Confirmed – Your Lock-In Has Started
        
        Hello ${userName},
        
        Great news! Your USDT deposit has been successfully processed and your lock-in investment has started.
        
        Investment Details:
        Amount: ${amount} USDT
        Plan: ${planName}
        Start Date: ${startDate}
        Maturity Date: ${maturityDate}
        Transaction ID: ${txId}
        
        View your dashboard: https://secureusdt.com/dashboard
        
        You can track your investment progress and profits in your dashboard.
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  // 3. Withdrawal Success Email
  withdrawalSuccess: (userName, userEmail, amount, txId, completionTime) => {
    return {
      subject: "Withdrawal Successful – Funds Credited",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Successful</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .transaction-details { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 150px; }
            .detail-value { color: #333; flex: 1; text-align: right; }
            .amount { font-size: 24px; font-weight: bold; color: #00d4aa; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">💰</div>
              <h1>Withdrawal Successful!</h1>
              <p>Your funds have been credited to your wallet</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Your withdrawal request has been successfully processed and the funds have been credited to your wallet.</p>
              
              <div class="transaction-details">
                <h3>💸 Withdrawal Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value amount">${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${txId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Completion Time:</span>
                  <span class="detail-value">${completionTime}</span>
                </div>
              </div>
              
              <p>Your funds are now available in your wallet. You can check your transaction history in your dashboard.</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated notification email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Withdrawal Successful – Funds Credited
        
        Hello ${userName},
        
        Your withdrawal request has been successfully processed and the funds have been credited to your wallet.
        
        Withdrawal Details:
        Amount: ${amount} USDT
        Transaction ID: ${txId}
        Completion Time: ${completionTime}
        
        Your funds are now available in your wallet.
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  // 5. Withdrawal Request Alert (Admin)
  withdrawalRequestAlert: (userName, userEmail, amount, planType, timestamp) => {
    return {
      subject: "New Withdrawal Request Submitted",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Withdrawal Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .alert-icon { font-size: 48px; margin-bottom: 20px; }
            .request-details { background: #fff3cd; border: 1px solid #ffeaa7; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 150px; }
            .detail-value { color: #333; flex: 1; text-align: right; }
            .amount { font-size: 24px; font-weight: bold; color: #ff6b6b; }
            .cta-button { background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="alert-icon">🚨</div>
              <h1>New Withdrawal Request</h1>
              <p>Action required - User withdrawal request pending approval</p>
            </div>
            <div class="content">
              <h2>Admin Alert</h2>
              <p>A new withdrawal request has been submitted and requires your review and approval.</p>
              
              <div class="request-details">
                <h3>📋 Request Details</h3>
                <div class="detail-row">
                  <span class="detail-label">User Name:</span>
                  <span class="detail-value">${userName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">User Email:</span>
                  <span class="detail-value">${userEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Withdrawal Amount:</span>
                  <span class="detail-value amount">${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Plan Type:</span>
                  <span class="detail-value">${planType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Request Time:</span>
                  <span class="detail-value">${timestamp}</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/admin/withdrawals" class="cta-button">Review Request</a>
              </div>
              
              <p><strong>Action Required:</strong> Please review this withdrawal request in the admin panel and approve or reject it based on your verification process.</p>
              
              <div class="footer">
                <p>SecureUSDT Admin System</p>
                <p>This is an automated alert email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Withdrawal Request Submitted
        
        Admin Alert
        
        A new withdrawal request has been submitted and requires your review and approval.
        
        Request Details:
        User Name: ${userName}
        User Email: ${userEmail}
        Withdrawal Amount: ${amount} USDT
        Plan Type: ${planType}
        Request Time: ${timestamp}
        
        Review request: https://secureusdt.com/admin/withdrawals
        
        Action Required: Please review this withdrawal request in the admin panel.
        
        SecureUSDT Admin System
      `
    };
  },

  // 7. Internal Transfer Received Email
  internalTransferReceived: (recipientName, recipientEmail, senderName, amount, txId, currentBalance) => {
    return {
      subject: "Funds Received – Internal Transfer Completed",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Funds Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .transfer-details { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 150px; }
            .detail-value { color: #333; flex: 1; text-align: right; }
            .amount { font-size: 24px; font-weight: bold; color: #00d4aa; }
            .balance { font-size: 20px; font-weight: bold; color: #00a8ff; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">💸</div>
              <h1>Funds Received!</h1>
              <p>Internal transfer completed successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${recipientName}!</h2>
              <p>You have received funds from an internal transfer within the SecureUSDT platform.</p>
              
              <div class="transfer-details">
                <h3>📊 Transfer Details</h3>
                <div class="detail-row">
                  <span class="detail-label">From:</span>
                  <span class="detail-value">${senderName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Received:</span>
                  <span class="detail-value amount">${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${txId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Current Balance:</span>
                  <span class="detail-value balance">${currentBalance} USDT</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/dashboard" class="cta-button">View Dashboard</a>
              </div>
              
              <p>The funds are now available in your wallet and ready for investment or withdrawal.</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated notification email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Funds Received – Internal Transfer Completed
        
        Hello ${recipientName},
        
        You have received funds from an internal transfer within the SecureUSDT platform.
        
        Transfer Details:
        From: ${senderName}
        Amount Received: ${amount} USDT
        Transaction ID: ${txId}
        Current Balance: ${currentBalance} USDT
        
        View dashboard: https://secureusdt.com/dashboard
        
        The funds are now available in your wallet.
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  // 8. Referral Bonus Notification
  referralBonus: (userName, userEmail, referralName, bonusAmount, walletBalance) => {
    return {
      subject: "You've Earned a New Referral Bonus!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Referral Bonus Earned</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .bonus-icon { font-size: 48px; margin-bottom: 20px; }
            .bonus-details { background: #fff8e1; border: 1px solid #ffd700; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 150px; }
            .detail-value { color: #333; flex: 1; text-align: right; }
            .bonus-amount { font-size: 24px; font-weight: bold; color: #ffd700; }
            .balance { font-size: 20px; font-weight: bold; color: #00d4aa; }
            .cta-button { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="bonus-icon">🎉</div>
              <h1>Referral Bonus Earned!</h1>
              <p>Congratulations on your new referral bonus</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Great news! You've earned a referral bonus for successfully referring a new user to SecureUSDT.</p>
              
              <div class="bonus-details">
                <h3>🎁 Bonus Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Referred User:</span>
                  <span class="detail-value">${referralName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Bonus Amount:</span>
                  <span class="detail-value bonus-amount">${bonusAmount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Current Balance:</span>
                  <span class="detail-value balance">${walletBalance} USDT</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/referrals" class="cta-button">View Referral Dashboard</a>
              </div>
              
              <p>Keep referring friends to earn more bonuses! The more people you refer, the more you earn.</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated notification email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        You've Earned a New Referral Bonus!
        
        Hello ${userName},
        
        Great news! You've earned a referral bonus for successfully referring a new user to SecureUSDT.
        
        Bonus Details:
        Referred User: ${referralName}
        Bonus Amount: ${bonusAmount} USDT
        Current Balance: ${walletBalance} USDT
        
        View referral dashboard: https://secureusdt.com/referrals
        
        Keep referring friends to earn more bonuses!
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  contactForm: (name, email, mobileNumber, subject, message) => {
    return {
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .contact-icon { font-size: 48px; margin-bottom: 20px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; min-width: 120px; }
            .detail-value { color: #333; flex: 1; }
            .message-content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00d4aa; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .priority { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="contact-icon">📧</div>
              <h1>New Contact Form Submission</h1>
              <p>Someone has contacted you through the website</p>
            </div>
            <div class="content">
              <h2>Contact Details</h2>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Mobile:</span>
                  <span class="detail-value"><a href="tel:${mobileNumber}">${mobileNumber}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Subject:</span>
                  <span class="detail-value">${subject}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${new Date().toLocaleString()}</span>
                </div>
              </div>
              
              <h3>Message</h3>
              <div class="message-content">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
              
              <div class="priority">
                <strong>Action Required:</strong> Please respond to this inquiry within 24 hours for the best customer experience.
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: #00d4aa; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                  Reply to Customer
                </a>
                <a href="tel:${mobileNumber}" style="display: inline-block; background: #00a8ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                  Call Customer
                </a>
              </div>
              
              <div class="footer">
                <p>This message was sent from the SecureUSDT contact form.</p>
                <p>Please respond directly to the customer's email address: <strong>${email}</strong></p>
                <p>Or call them at: <strong>${mobileNumber}</strong></p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p><small>This is an automated message from the SecureUSDT website.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission - SecureUSDT
        
        Contact Details:
        Name: ${name}
        Email: ${email}
        Mobile: ${mobileNumber}
        Subject: ${subject}
        Date: ${new Date().toLocaleString()}
        
        Message:
        ${message}
        
        Action Required: Please respond to this inquiry within 24 hours for the best customer experience.
        
        Reply directly to: ${email}
        Call customer at: ${mobileNumber}
        
        ---
        This message was sent from the SecureUSDT contact form.
        This is an automated message from the SecureUSDT website.
      `
    };
  }
};

// Send email function
const sendEmail = async (toEmail, templateName, fromEmail = 'noreply@secureusdt.com', ...templateParams) => {
  try {
    const sesClient = createSESClient();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    const emailContent = typeof template === 'function' ? template(...templateParams) : template;
    
    const command = new SendEmailCommand({
      Source: fromEmail, // Dynamic sender email
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: emailContent.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: emailContent.html,
            Charset: 'UTF-8',
          },
          Text: {
            Data: emailContent.text,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log('Email sent successfully:', result.MessageId);
    
    return {
      success: true,
      messageId: result.MessageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email'
    };
  }
};

// Send contact form email
const sendContactFormEmail = async (name, email, mobileNumber, subject, message) => {
  return await sendEmail(
    'admin@secureusdt.com', // Admin email for contact form submissions
    'contactForm',
    name,
    email,
    mobileNumber,
    subject,
    message
  );
};

// Send deposit success email
const sendDepositSuccessEmail = async (userEmail, userName, amount, planName, startDate, maturityDate, txId) => {
  return await sendEmail(
    userEmail,
    'depositSuccess',
    'payments@secureusdt.com',
    userName,
    userEmail,
    amount,
    planName,
    startDate,
    maturityDate,
    txId
  );
};

// 1. Welcome Email
const sendWelcomeEmail = async (userEmail, userName) => {
  return await sendEmail(
    userEmail,
    'welcomeEmail',
    'noreply@secureusdt.com',
    userName,
    userEmail
  );
};

// 3. Withdrawal Success Email
const sendWithdrawalSuccessEmail = async (userEmail, userName, amount, txId, completionTime) => {
  return await sendEmail(
    userEmail,
    'withdrawalSuccess',
    'payments@secureusdt.com',
    userName,
    userEmail,
    amount,
    txId,
    completionTime
  );
};

// 5. Withdrawal Request Alert (Admin)
const sendWithdrawalRequestAlert = async (userName, userEmail, amount, planType, timestamp) => {
  return await sendEmail(
    'admin@secureusdt.com',
    'withdrawalRequestAlert',
    'payments@secureusdt.com',
    userName,
    userEmail,
    amount,
    planType,
    timestamp
  );
};

// 7. Internal Transfer Received Email
const sendInternalTransferReceivedEmail = async (recipientEmail, recipientName, senderName, amount, txId, currentBalance) => {
  return await sendEmail(
    recipientEmail,
    'internalTransferReceived',
    'payments@secureusdt.com',
    recipientName,
    recipientEmail,
    senderName,
    amount,
    txId,
    currentBalance
  );
};

// 8. Referral Bonus Notification
const sendReferralBonusEmail = async (userEmail, userName, referralName, bonusAmount, walletBalance) => {
  return await sendEmail(
    userEmail,
    'referralBonus',
    'payments@secureusdt.com',
    userName,
    userEmail,
    referralName,
    bonusAmount,
    walletBalance
  );
};

module.exports = {
  sendEmail,
  sendContactFormEmail,
  sendDepositSuccessEmail,
  sendWelcomeEmail,
  sendWithdrawalSuccessEmail,
  sendWithdrawalRequestAlert,
  sendInternalTransferReceivedEmail,
  sendReferralBonusEmail,
  emailTemplates
};