import axios from 'axios';
import { url } from '../constants';

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await axios.post(`${url}/email-verification/verify`, {
      token
    });
    return response.data;
  } catch (error) {
    console.error('Verify email error:', error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${url}/email-verification/resend-verification`, {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Resend verification email error:', error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

// Send verification email (for manual trigger)
export const sendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${url}/email-verification/send-verification`, {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Send verification email error:', error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};
