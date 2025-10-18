import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/terms`;

// Get latest terms (for users)
const getLatestTerms = async () => {
    try {
        let response = await axios.get(`${fileUrl}/latest`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch terms" };
    }
};

// Get terms by ID
const getTermsById = async (id) => {
    try {
        let response = await axios.get(`${fileUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch terms" };
    }
};

// Get all terms (admin only)
const getAllTerms = async () => {
    try {
        let response = await axios.get(`${fileUrl}/admin/all`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch all terms" };
    }
};

// Create terms (admin only)
const createTerms = async (payload) => {
    try {
        let response = await axios.post(`${fileUrl}/admin/create`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to create terms" };
    }
};

// Update terms (admin only)
const updateTerms = async (id, payload) => {
    try {
        let response = await axios.put(`${fileUrl}/admin/update/${id}`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to update terms" };
    }
};

// Delete terms (admin only)
const deleteTerms = async (id) => {
    try {
        let response = await axios.delete(`${fileUrl}/admin/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to delete terms" };
    }
};

export { 
    getLatestTerms, 
    getTermsById, 
    getAllTerms, 
    createTerms, 
    updateTerms, 
    deleteTerms 
};
