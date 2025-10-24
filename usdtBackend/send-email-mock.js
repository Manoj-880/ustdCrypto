const { sendContactFormEmail } = require('./services/mockEmailService');

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
    console.log('🚀 Sending contact form email to manoj.inamanamelluri123@gmail.com...');
    console.log('📝 Using mock email service for demonstration');
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
      console.log('');
      console.log('✅ Mock email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Message:', result.message);
      console.log('');
      console.log('📋 This demonstrates what the email would look like when sent to manoj.inamanamelluri123@gmail.com');
      console.log('🔧 To send real emails, configure AWS SES or Gmail SMTP credentials');
    } else {
      console.log('❌ Failed to send mock email');
      console.log('Error:', result.message);
    }
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  }
}

// Run the email sending
sendEmailToManoj();
