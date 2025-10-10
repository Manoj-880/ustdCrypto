import axios from "axios";
import { url } from "../constants";

const createWithdrawalRequest = async (payload) => {
    try {
        console.log('🚀 Making API call to create withdrawal request:', `${url}/withdrawal-requests`, payload);
        let response = await axios.post(`${url}/withdrawal-requests`, payload);
        console.log('✅ Withdrawal request response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Withdrawal request error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const getWithdrawalRequests = async (userId) => {
    try {
        console.log('🚀 Making API call to get withdrawal requests:', `${url}/withdrawal-requests/${userId}`);
        let response = await axios.get(`${url}/withdrawal-requests/${userId}`);
        console.log('✅ Get withdrawal requests response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Get withdrawal requests error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const transferToWallet = async (payload) => {
    try {
        console.log('🚀 Making API call to transfer to wallet:', `${url}/transfers`, payload);
        let response = await axios.post(`${url}/transfers`, payload);
        console.log('✅ Transfer to wallet response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Transfer to wallet error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const getWithdrawalRequestsByUserId = async (userId) => {
    try {
        console.log('🚀 Making API call to get withdrawal requests for user:', `${url}/withdrawal-requests/user/${userId}`);
        let response = await axios.get(`${url}/withdrawal-requests/user/${userId}`);
        console.log('✅ Get user withdrawal requests response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Get user withdrawal requests error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

export { createWithdrawalRequest, getWithdrawalRequests, transferToWallet, getWithdrawalRequestsByUserId };
