const nodemailer = require('nodemailer');

// Create a simple email service using Gmail SMTP
const createTransporter = () => {
  // For testing purposes, you can use a Gmail account
  // You'll need to generate an App Password for Gmail
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
  
  return transporter;
};

// Email templates (same as the original)
const emailTemplates = {
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
const sendEmail = async (toEmail, templateName, ...templateParams) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    const emailContent = typeof template === 'function' ? template(...templateParams) : template;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: toEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
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
    'manoj.inamanamelluri123@gmail.com', // Target email
    'contactForm',
    name,
    email,
    mobileNumber,
    subject,
    message
  );
};

module.exports = {
  sendEmail,
  sendContactFormEmail,
  emailTemplates
};
