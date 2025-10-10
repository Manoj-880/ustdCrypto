import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/faq`;

// Get all FAQs (for users)
const getAllFAQs = async () => {
    try {
        let response = await axios.get(fileUrl);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch FAQs" };
    }
};

// Get FAQ by ID
const getFAQById = async (id) => {
    try {
        let response = await axios.get(`${fileUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch FAQ" };
    }
};

// Create FAQ (admin only)
const createFAQ = async (payload) => {
    try {
        let response = await axios.post(fileUrl, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to create FAQ" };
    }
};

// Update FAQ (admin only)
const updateFAQ = async (id, payload) => {
    try {
        let response = await axios.put(`${fileUrl}/${id}`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to update FAQ" };
    }
};

// Delete FAQ (admin only)
const deleteFAQ = async (id) => {
    try {
        let response = await axios.delete(`${fileUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to delete FAQ" };
    }
};

// Get FAQs by category
const getFAQsByCategory = async (category) => {
    try {
        let response = await axios.get(`${fileUrl}/category/${category}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to fetch FAQs by category" };
    }
};

export { 
    getAllFAQs, 
    getFAQById, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ, 
    getFAQsByCategory 
};
