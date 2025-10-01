const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Configure AWS SES
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1', // Change to your preferred region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Email templates
const emailTemplates = {
  depositSuccess: (userEmail, userName, amount, txId, date) => {
    return {
      subject: 'Deposit Confirmed - USDT Transaction Successful',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Deposit Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .amount { font-size: 24px; font-weight: bold; color: #28a745; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Deposit Confirmed!</h1>
              <p>Your USDT deposit has been successfully processed</p>
            </div>
            <div class="content">
              <h2>Hello ${userName || 'Valued Customer'},</h2>
              <p>We're pleased to inform you that your USDT deposit has been successfully processed and added to your account balance.</p>
              
              <div class="amount">$${amount} USDT</div>
              
              <div class="details">
                <h3>Transaction Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${txId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value">$${amount} USDT</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span>
                  <span class="detail-value">${new Date(date).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #28a745; font-weight: bold;">Confirmed</span>
                </div>
              </div>
              
              <p>Your new balance has been updated and is now available for trading or withdrawal.</p>
              
              <div style="text-align: center;">
                <a href="#" class="button">View Account Dashboard</a>
              </div>
              
              <div class="footer">
                <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
                <p>Thank you for choosing our platform!</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p><small>This is an automated message. Please do not reply to this email.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Deposit Confirmed - USDT Transaction Successful
        
        Hello ${userName || 'Valued Customer'},
        
        We're pleased to inform you that your USDT deposit has been successfully processed and added to your account balance.
        
        Amount: $${amount} USDT
        Transaction ID: ${txId}
        Date & Time: ${new Date(date).toLocaleString()}
        Status: Confirmed
        
        Your new balance has been updated and is now available for trading or withdrawal.
        
        If you have any questions or concerns, please don't hesitate to contact our support team.
        
        Thank you for choosing our platform!
        
        ---
        This is an automated message. Please do not reply to this email.
      `
    };
  }
};

// Send email function
const sendEmail = async (toEmail, templateName, templateData) => {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn('AWS SES credentials not configured. Email sending disabled.');
      return { success: false, message: 'Email service not configured' };
    }

    if (!process.env.FROM_EMAIL) {
      console.warn('FROM_EMAIL environment variable not set. Email sending disabled.');
      return { success: false, message: 'From email not configured' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(...templateData);

    const command = new SendEmailCommand({
      Source: process.env.FROM_EMAIL, // Verified email in SES
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
      message: 'Failed to send email',
      error: error.message
    };
  }
};

// Send deposit success email
const sendDepositSuccessEmail = async (userEmail, userName, amount, txId, date) => {
  return await sendEmail(
    userEmail,
    'depositSuccess',
    [userEmail, userName, amount, txId, date]
  );
};

module.exports = {
  sendEmail,
  sendDepositSuccessEmail,
  emailTemplates
};
