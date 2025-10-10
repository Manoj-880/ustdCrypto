import axios from "axios";
import { url } from "../constants";

const verifyPayment = async (payload) => {
    try {
        console.log('🚀 Making API call to verify payment:', `${url}/payment/verify`, payload);
        let response = await axios.post(`${url}/payment/verify`, payload);
        console.log('✅ Payment verification response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Payment verification error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

export { verifyPayment };
