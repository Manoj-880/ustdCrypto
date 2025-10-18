const { sendContactFormEmail } = require('../services/emailService');

// Verify Turnstile token with Cloudflare
const verifyTurnstileToken = async (token) => {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: '127.0.0.1' // You can get this from req.ip in production
      }),
    });

    const result = await response.json();
    return {
      success: result.success,
      error: result['error-codes'] || []
    };
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return {
      success: false,
      error: ['verification-failed']
    };
  }
};

const submitContactForm = async (req, res) => {
  try {
    const { name, email, mobileNumber, subject, message, turnstileToken } = req.body;
    
    // Validate required fields
    if (!name || !email || !mobileNumber || !subject || !message) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required',
      });
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return res.status(400).send({
        success: false,
        message: 'Security verification is required',
      });
    }

    // Verify Turnstile token with Cloudflare
    const turnstileResponse = await verifyTurnstileToken(turnstileToken);
    if (!turnstileResponse.success) {
      return res.status(400).send({
        success: false,
        message: 'Security verification failed. Please try again.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(400).send({
        success: false,
        message: 'Please enter a valid mobile number',
      });
    }

    // Send email to admin
    const emailResult = await sendContactFormEmail(
      name,
      email,
      mobileNumber,
      subject,
      message
    );

    if (emailResult.success) {
      console.log('Contact form email sent successfully:', emailResult.messageId);
      res.status(200).send({
        success: true,
        message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
        messageId: emailResult.messageId
      });
    } else {
      console.error('Failed to send contact form email:', emailResult.message);
      res.status(500).send({
        success: false,
        message: 'Failed to send your message. Please try again later.',
        error: emailResult.message
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).send({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message
    });
  }
};

module.exports = {
  submitContactForm
};
