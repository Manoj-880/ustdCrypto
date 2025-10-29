import axios from "axios";
import { url } from "../constants";

const verifyPayment = async (payload) => {
  try {
    let response = await axios.post(`${url}/payment/make-payment`, payload);
    return response.data;
  } catch (error) {
    console.error("Payment verification error:", error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

export { verifyPayment };
