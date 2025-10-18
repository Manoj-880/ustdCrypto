import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/privacy-policy`;

// Get latest privacy policy (for users)
const getLatestPrivacyPolicy = async () => {
    try {
        let response = await axios.get(`${fileUrl}/latest`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch privacy policy" };
    }
};

// Get privacy policy by ID
const getPrivacyPolicyById = async (id) => {
    try {
        let response = await axios.get(`${fileUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch privacy policy" };
    }
};

// Get all privacy policies (admin only)
const getAllPrivacyPolicies = async () => {
    try {
        let response = await axios.get(`${fileUrl}/admin/all`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch all privacy policies" };
    }
};

// Create privacy policy (admin only)
const createPrivacyPolicy = async (payload) => {
    try {
        let response = await axios.post(`${fileUrl}/admin/create`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to create privacy policy" };
    }
};

// Update privacy policy (admin only)
const updatePrivacyPolicy = async (id, payload) => {
    try {
        let response = await axios.put(`${fileUrl}/admin/update/${id}`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to update privacy policy" };
    }
};

// Delete privacy policy (admin only)
const deletePrivacyPolicy = async (id) => {
    try {
        let response = await axios.delete(`${fileUrl}/admin/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to delete privacy policy" };
    }
};

export { 
    getLatestPrivacyPolicy, 
    getPrivacyPolicyById, 
    getAllPrivacyPolicies, 
    createPrivacyPolicy, 
    updatePrivacyPolicy, 
    deletePrivacyPolicy 
};
