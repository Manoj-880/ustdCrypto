const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const unifiedPdfInvoiceService = require('./unifiedPdfInvoiceService');

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
              <div class="logo">SecureUSDT</div>
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

  // 8. Internal Transfer Sent Email
  internalTransferSent: (senderName, senderEmail, recipientName, amount, txId, currentBalance) => {
    return {
      subject: "Transfer Sent – Internal Transfer Completed",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transfer Sent</title>
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
            .amount { font-size: 24px; font-weight: bold; color: #ff6b6b; }
            .balance { font-size: 20px; font-weight: bold; color: #00a8ff; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">📤</div>
              <h1>Transfer Sent!</h1>
              <p>Internal transfer completed successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${senderName}!</h2>
              <p>Your internal transfer has been successfully processed and sent to the recipient.</p>
              
              <div class="transfer-details">
                <h3>📊 Transfer Details</h3>
                <div class="detail-row">
                  <span class="detail-label">To:</span>
                  <span class="detail-value">${recipientName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Sent:</span>
                  <span class="detail-value amount">-${amount} USDT</span>
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
              
              <p>The transfer has been completed and the recipient has been notified. You can view your updated balance in your dashboard.</p>
              
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
        Transfer Sent – Internal Transfer Completed
        
        Hello ${senderName},
        
        Your internal transfer has been successfully processed and sent to the recipient.
        
        Transfer Details:
        To: ${recipientName}
        Amount Sent: -${amount} USDT
        Transaction ID: ${txId}
        Current Balance: ${currentBalance} USDT
        
        View dashboard: https://secureusdt.com/dashboard
        
        The transfer has been completed and the recipient has been notified.
        
        Best regards,
        The SecureUSDT Team
      `
    };
  },

  // 9. Referral Bonus Notification
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
  },


  // 10. Withdrawal Request Rejection Email
  withdrawalRejection: (userName, userEmail, amount, rejectionReason, requestDate) => {
    return {
      subject: "Withdrawal Request Rejected - SecureUSDT",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Request Rejected - SecureUSDT</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #bd2130 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .rejection-box { background: #f8d7da; border: 2px solid #f5c6cb; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
            .rejection-icon { font-size: 48px; margin-bottom: 15px; }
            .amount-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .reason-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; color: #856404; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SecureUSDT</div>
              <h1>Withdrawal Request Rejected</h1>
              <p>Your withdrawal request has been reviewed and rejected</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We regret to inform you that your withdrawal request has been rejected after careful review by our team.</p>
              
              <div class="rejection-box">
                <div class="rejection-icon">❌</div>
                <h3>Withdrawal Request Rejected</h3>
                <p>Your request has been declined and the funds have been returned to your account balance.</p>
              </div>
              
              <div class="amount-box">
                <h4>Request Details:</h4>
                <p><strong>Amount:</strong> ${amount} USDT</p>
                <p><strong>Request Date:</strong> ${new Date(requestDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">REJECTED</span></p>
              </div>
              
              <div class="reason-box">
                <h4>📋 Rejection Reason:</h4>
                <p style="font-style: italic; margin: 10px 0;">"${rejectionReason}"</p>
              </div>
              
              <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>💡 What You Can Do:</h4>
                <ul style="text-align: left; margin: 10px 0;">
                  <li>Review the rejection reason above</li>
                  <li>Ensure your wallet address is correct and valid</li>
                  <li>Check that you have sufficient balance for withdrawal</li>
                  <li>Contact our support team if you need clarification</li>
                  <li>Submit a new withdrawal request when ready</li>
                </ul>
              </div>
              
              <p>If you have any questions about this rejection or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from SecureUSDT. Please do not reply to this email.</p>
              <p>© 2024 SecureUSDT. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Withdrawal Request Rejected - SecureUSDT
        
        Hello ${userName}!
        
        We regret to inform you that your withdrawal request has been rejected after careful review by our team.
        
        REQUEST DETAILS:
        Amount: ${amount} USDT
        Request Date: ${new Date(requestDate).toLocaleDateString()}
        Status: REJECTED
        
        REJECTION REASON:
        "${rejectionReason}"
        
        WHAT YOU CAN DO:
        - Review the rejection reason above
        - Ensure your wallet address is correct and valid
        - Check that you have sufficient balance for withdrawal
        - Contact our support team if you need clarification
        - Submit a new withdrawal request when ready
        
        If you have any questions about this rejection or need assistance, please don't hesitate to contact our support team.
        
        This is an automated message from SecureUSDT. Please do not reply to this email.
        © 2024 SecureUSDT. All rights reserved.
      `
    };
  },

  // 11. Admin Balance Added Email
  adminBalanceAdded: (userName, userEmail, amount, newBalance, transactionId, reason) => {
    return {
      subject: "Balance Added to Your Account – SecureUSDT",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Balance Added</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .success-title { font-size: 28px; margin: 20px 0; color: #00d4aa; }
            .balance-info { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center; }
            .amount { font-size: 36px; font-weight: bold; color: #00d4aa; margin: 10px 0; }
            .transaction-details { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #ddd; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .reason-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SecureUSDT</div>
              <h1 class="success-title">Balance Added Successfully!</h1>
              <p>Your account has been credited with additional funds</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Great news! We've successfully added funds to your SecureUSDT account.</p>
              
              <div class="balance-info">
                <h3>💰 Amount Added</h3>
                <div class="amount">+${amount} USDT</div>
                <p>Your new balance: <strong>${newBalance} USDT</strong></p>
              </div>
              
              <div class="transaction-details">
                <h3>📋 Transaction Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${transactionId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Added:</span>
                  <span class="detail-value">${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">New Balance:</span>
                  <span class="detail-value">${newBalance} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              
              ${reason ? `
                <div class="reason-box">
                  <h4>📝 Reason:</h4>
                  <p>${reason}</p>
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="https://secureusdt.com/dashboard" class="cta-button">View Your Dashboard</a>
              </div>
              
              <p>You can now use these funds to invest in our secure lock-in plans or make withdrawals. If you have any questions about this transaction, please contact our support team.</p>
              
              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated email from payments@secureusdt.com. Please do not reply to this message.</p>
                <p>© 2024 SecureUSDT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Balance Added to Your Account – SecureUSDT
        
        Hello ${userName},
        
        Great news! We've successfully added funds to your SecureUSDT account.
        
        Amount Added: +${amount} USDT
        Your new balance: ${newBalance} USDT
        
        Transaction Details:
        - Transaction ID: ${transactionId}
        - Amount Added: ${amount} USDT
        - New Balance: ${newBalance} USDT
        - Date: ${new Date().toLocaleDateString()}
        - Time: ${new Date().toLocaleTimeString()}
        ${reason ? `- Reason: ${reason}` : ''}
        
        You can now use these funds to invest in our secure lock-in plans or make withdrawals.
        
        View your dashboard: https://secureusdt.com/dashboard
        
        If you have any questions about this transaction, please contact our support team.
        
        Best regards,
        The SecureUSDT Team
        
        This is an automated email from payments@secureusdt.com. Please do not reply to this message.
        © 2024 SecureUSDT. All rights reserved.
      `
    };
  },

  // 12. Email Verification Email
  emailVerification: (userName, userEmail, verificationLink) => {
    return {
      subject: "Verify Your Email Address – SecureUSDT",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .verification-title { font-size: 28px; margin: 20px 0; color: #00d4aa; }
            .verification-info { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center; }
            .verification-link { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; font-size: 18px; }
            .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .expiry-notice { color: #dc3545; font-weight: bold; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SecureUSDT</div>
              <h1 class="verification-title">Verify Your Email Address</h1>
              <p>Complete your account setup to get started</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Thank you for registering with SecureUSDT. To complete your account setup and start using our platform, please verify your email address.</p>

              <div class="verification-info">
                <h3>📧 Email Verification Required</h3>
                <p>Click the button below to verify your email address:</p>
                <a href="${verificationLink}" class="verification-link">Verify Email Address</a>
                <div class="expiry-notice">⏰ This link will expire in 24 hours</div>
              </div>

              <div class="security-notice">
                <h4>🔒 Security Notice</h4>
                <p>If you didn't create an account with SecureUSDT, please ignore this email. Your account will not be activated without email verification.</p>
              </div>

              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>Access your SecureUSDT dashboard</li>
                <li>Make deposits and investments</li>
                <li>Track your profits and transactions</li>
                <li>Withdraw your earnings</li>
              </ul>

              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; background: #f8f9fa; padding: 10px; border-radius: 4px;">${verificationLink}</p>

              <div class="footer">
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This is an automated email from noreply@secureusdt.com. Please do not reply to this message.</p>
                <p>© 2024 SecureUSDT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Email Verification – SecureUSDT

        Hello ${userName},

        Thank you for registering with SecureUSDT. To complete your account setup and start using our platform, please verify your email address.

        Click the link below to verify your email:
        ${verificationLink}

        This link will expire in 24 hours.

        Security Notice:
        If you didn't create an account with SecureUSDT, please ignore this email. Your account will not be activated without email verification.

        Once verified, you'll be able to:
        - Access your SecureUSDT dashboard
        - Make deposits and investments
        - Track your profits and transactions
        - Withdraw your earnings

        Best regards,
        The SecureUSDT Team

        This is an automated email from noreply@secureusdt.com. Please do not reply to this message.
        © 2024 SecureUSDT. All rights reserved.
      `
    };
  },

  // 13. Post-Verification Welcome Email
  postVerificationWelcome: (userName, userEmail, loginUrl) => {
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
            .header { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .welcome-title { font-size: 28px; margin: 20px 0; color: #00d4aa; }
            .success-badge { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold; }
            .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .feature-item { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .feature-icon { font-size: 32px; margin-bottom: 10px; }
            .cta-button { background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .security-note { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SecureUSDT</div>
              <h1 class="welcome-title">Welcome to SecureUSDT!</h1>
              <p>Your account is now ready to use</p>
            </div>
            <div class="content">
              <div class="success-badge">
                ✅ Email Verified Successfully!
              </div>
              
              <h2>Hello ${userName}!</h2>
              <p>Congratulations! Your email has been verified and your SecureUSDT account is now fully activated. You're ready to start your investment journey with us.</p>

              <h3>🚀 What You Can Do Now:</h3>
              <div class="features-grid">
                <div class="feature-item">
                  <div class="feature-icon">💰</div>
                  <h4>Make Deposits</h4>
                  <p>Start investing with USDT and watch your portfolio grow</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📊</div>
                  <h4>Track Performance</h4>
                  <p>Monitor your investments with real-time analytics</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">🔒</div>
                  <h4>Secure Investment</h4>
                  <p>Invest with confidence using our secure platform</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📈</div>
                  <h4>Earn Profits</h4>
                  <p>Access various investment opportunities</p>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" class="cta-button">Login to Your Account</a>
              </div>

              <div class="security-note">
                <h4>🔐 Security Reminder</h4>
                <p>Keep your login credentials secure and never share them with anyone. SecureUSDT will never ask for your password via email.</p>
              </div>

              <h3>📞 Need Help?</h3>
              <p>If you have any questions or need assistance, our support team is here to help:</p>
              <ul>
                <li>📧 Email: support@secureusdt.com</li>
                <li>💬 Live Chat: Available 24/7 on our platform</li>
                <li>📚 Help Center: Comprehensive guides and FAQs</li>
              </ul>

              <div class="footer">
                <p>Welcome to the SecureUSDT family!</p>
                <p>Best regards,<br>The SecureUSDT Team</p>
                <p>This email was sent from admin@secureusdt.com</p>
                <p>© 2024 SecureUSDT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to SecureUSDT – Your Account is Ready!

        Hello ${userName},

        Congratulations! Your email has been verified and your SecureUSDT account is now fully activated. You're ready to start your investment journey with us.

        ✅ Email Verified Successfully!

        What You Can Do Now:
        💰 Make Deposits - Start investing with USDT and watch your portfolio grow
        📊 Track Performance - Monitor your investments with real-time analytics
        🔒 Secure Investment - Invest with confidence using our secure platform
        📈 Earn Profits - Access various investment opportunities

        Login to your account: ${loginUrl}

        Security Reminder:
        Keep your login credentials secure and never share them with anyone. SecureUSDT will never ask for your password via email.

        Need Help?
        📧 Email: support@secureusdt.com
        💬 Live Chat: Available 24/7 on our platform
        📚 Help Center: Comprehensive guides and FAQs

        Welcome to the SecureUSDT family!

        Best regards,
        The SecureUSDT Team

        This email was sent from admin@secureusdt.com
        © 2024 SecureUSDT. All rights reserved.
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

// Send email with PDF attachment function
const sendEmailWithAttachment = async (toEmail, templateName, fromEmail = 'noreply@secureusdt.com', ...templateParams) => {
  try {
    const sesClient = createSESClient();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    // Extract PDF attachment and filename from templateParams
    const pdfAttachment = templateParams[templateParams.length - 2];
    const pdfFilename = templateParams[templateParams.length - 1];
    
    // Remove PDF attachment params from template params
    const cleanTemplateParams = templateParams.slice(0, -2);
    
    const emailContent = typeof template === 'function' ? template(...cleanTemplateParams) : template;
    
    const command = new SendEmailCommand({
      Source: fromEmail,
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
      // Add attachment if PDF is provided
      ...(pdfAttachment && {
        Raw: {
          Data: Buffer.concat([
            Buffer.from(`From: ${fromEmail}\r\n`),
            Buffer.from(`To: ${toEmail}\r\n`),
            Buffer.from(`Subject: ${emailContent.subject}\r\n`),
            Buffer.from(`MIME-Version: 1.0\r\n`),
            Buffer.from(`Content-Type: multipart/mixed; boundary="boundary123"\r\n\r\n`),
            Buffer.from(`--boundary123\r\n`),
            Buffer.from(`Content-Type: text/html; charset=UTF-8\r\n\r\n`),
            Buffer.from(emailContent.html),
            Buffer.from(`\r\n--boundary123\r\n`),
            Buffer.from(`Content-Type: application/pdf\r\n`),
            Buffer.from(`Content-Disposition: attachment; filename="${pdfFilename}"\r\n`),
            Buffer.from(`Content-Transfer-Encoding: base64\r\n\r\n`),
            pdfAttachment,
            Buffer.from(`\r\n--boundary123--\r\n`)
          ])
        }
      })
    });

    const result = await sesClient.send(command);
    console.log('Email with PDF attachment sent successfully:', result.MessageId);
    
    return {
      success: true,
      messageId: result.MessageId,
      message: 'Email with PDF attachment sent successfully'
    };
  } catch (error) {
    console.error('Error sending email with attachment:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email with attachment'
    };
  }
};

// Send contact form email
const sendContactFormEmail = async (name, email, mobileNumber, subject, message) => {
  return await sendEmail(
    'admin@secureusdt.com', // Admin email for contact form submissions
    'contactForm',
    'noreply@secureusdt.com', // Send from noreply email
    name,
    email,
    mobileNumber,
    subject,
    message
  );
};

// Send deposit success email with PDF invoice
const sendDepositSuccessEmail = async (userEmail, userName, amount, planName, startDate, maturityDate, txId, userData = null, transactionData = null) => {
  try {
    let pdfAttachment = null;
    
    // Generate PDF invoice if user data and transaction data are provided
    if (userData && transactionData) {
      try {
        const pdfDataUri = await unifiedPdfInvoiceService.generateDepositInvoice(userData, transactionData);
        pdfAttachment = await unifiedPdfInvoiceService.pdfToBuffer(pdfDataUri);
      } catch (pdfError) {
        console.error('Failed to generate deposit PDF invoice:', pdfError);
        // Continue without PDF attachment
      }
    }

    return await sendEmailWithAttachment(
      userEmail,
      'depositSuccess',
      'payments@secureusdt.com',
      userName,
      userEmail,
      amount,
      planName,
      startDate,
      maturityDate,
      txId,
      pdfAttachment,
      'Deposit_Invoice.pdf'
    );
  } catch (error) {
    console.error('Error in sendDepositSuccessEmail:', error);
    // Fallback to regular email without PDF
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
  }
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

// 3. Withdrawal Success Email with PDF invoice
const sendWithdrawalSuccessEmail = async (userEmail, userName, amount, txId, completionTime, userData = null, transactionData = null, withdrawalData = null) => {
  try {
    let pdfAttachment = null;
    
    // Generate PDF invoice if user data and transaction data are provided
    if (userData && transactionData) {
      try {
        const pdfDataUri = await unifiedPdfInvoiceService.generateWithdrawalInvoice(userData, transactionData, withdrawalData);
        pdfAttachment = await unifiedPdfInvoiceService.pdfToBuffer(pdfDataUri);
      } catch (pdfError) {
        console.error('Failed to generate withdrawal PDF invoice:', pdfError);
        // Continue without PDF attachment
      }
    }

    return await sendEmailWithAttachment(
      userEmail,
      'withdrawalSuccess',
      'payments@secureusdt.com',
      userName,
      userEmail,
      amount,
      txId,
      completionTime,
      pdfAttachment,
      'Withdrawal_Invoice.pdf'
    );
  } catch (error) {
    console.error('Error in sendWithdrawalSuccessEmail:', error);
    // Fallback to regular email without PDF
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
  }
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

// 8. Internal Transfer Sent Email
const sendInternalTransferSentEmail = async (senderEmail, senderName, recipientName, amount, txId, currentBalance) => {
  return await sendEmail(
    senderEmail,
    'internalTransferSent',
    'payments@secureusdt.com',
    senderName,
    senderEmail,
    recipientName,
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


// 10. Withdrawal Rejection Email
const sendWithdrawalRejectionEmail = async (userEmail, userName, amount, rejectionReason, requestDate) => {
  return await sendEmail(
    userEmail,
    'withdrawalRejection',
    'payments@secureusdt.com',
    userName,
    userEmail,
    amount,
    rejectionReason,
    requestDate
  );
};

// 11. Admin Balance Added Email with PDF invoice
const sendAdminBalanceAddedEmail = async (userEmail, userName, amount, newBalance, transactionId, reason, userData = null, transactionData = null, adminData = null) => {
  try {
    let pdfAttachment = null;
    
    // Generate PDF invoice if user data and transaction data are provided
    if (userData && transactionData) {
      try {
        const pdfDataUri = await unifiedPdfInvoiceService.generateAdminBalanceInvoice(userData, transactionData, adminData, reason);
        pdfAttachment = await unifiedPdfInvoiceService.pdfToBuffer(pdfDataUri);
      } catch (pdfError) {
        console.error('Failed to generate admin balance PDF invoice:', pdfError);
        // Continue without PDF attachment
      }
    }

    return await sendEmailWithAttachment(
      userEmail,
      'adminBalanceAdded',
      'payments@secureusdt.com',
      userName,
      userEmail,
      amount,
      newBalance,
      transactionId,
      reason,
      pdfAttachment,
      'Balance_Addition_Invoice.pdf'
    );
  } catch (error) {
    console.error('Error in sendAdminBalanceAddedEmail:', error);
    // Fallback to regular email without PDF
    return await sendEmail(
      userEmail,
      'adminBalanceAdded',
      'payments@secureusdt.com',
      userName,
      userEmail,
      amount,
      newBalance,
      transactionId,
      reason
    );
  }
};

module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendContactFormEmail,
  sendDepositSuccessEmail,
  sendWelcomeEmail,
  sendWithdrawalSuccessEmail,
  sendWithdrawalRequestAlert,
  sendInternalTransferReceivedEmail,
  sendInternalTransferSentEmail,
  sendReferralBonusEmail,
  sendWithdrawalRejectionEmail,
  sendAdminBalanceAddedEmail,
  emailTemplates
};