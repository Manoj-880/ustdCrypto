const { sendContactFormEmail } = require('./services/simpleEmailService');

// Test data for the contact form email
const testContactData = {
  name: 'Test User',
  email: 'test@example.com',
  mobileNumber: '+1234567890',
  subject: 'Test Contact Form Submission',
  message: 'This is a test message sent from the contact form to verify email functionality. The email should be delivered to manoj.inamanamelluri123@gmail.com.'
};

async function sendEmailToManoj() {
  try {
    console.log('Sending contact form email to manoj.inamanamelluri123@gmail.com...');
    console.log('Note: You need to set up Gmail credentials in environment variables:');
    console.log('EMAIL_USER=your-gmail@gmail.com');
    console.log('EMAIL_PASS=your-app-password');
    console.log('');
    
    // Send the contact form email
    const result = await sendContactFormEmail(
      testContactData.name,
      testContactData.email,
      testContactData.mobileNumber,
      testContactData.subject,
      testContactData.message
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Message:', result.message);
    } else {
      console.log('❌ Failed to send email');
      console.log('Error:', result.message);
      console.log('');
      console.log('To fix this, you need to:');
      console.log('1. Set up a Gmail account');
      console.log('2. Enable 2-factor authentication');
      console.log('3. Generate an App Password');
      console.log('4. Set environment variables:');
      console.log('   export EMAIL_USER="your-gmail@gmail.com"');
      console.log('   export EMAIL_PASS="your-app-password"');
    }
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  }
}

// Run the email sending
sendEmailToManoj();
