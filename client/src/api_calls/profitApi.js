import axios from "axios";
import { url } from "../constants";

const profitUrl = `${url}/profits`;

// Get all profits (admin)
const getAllProfits = async () => {
    try {
        const response = await axios.get(profitUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching all profits:", error);
        return error.response?.data || { success: false, message: "Failed to fetch profits" };
    }
};

// Get profits by user ID
const getProfitsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${profitUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching profits for user ${userId}:`, error);
        return error.response?.data || { success: false, message: "Failed to fetch user profits" };
    }
};

// Claim profit
const claimProfit = async (userId) => {
    try {
        const response = await axios.post(`${profitUrl}/claim`, { userId });
        return response.data;
    } catch (error) {
        console.error("Error claiming profit:", error);
        return error.response?.data || { success: false, message: "Failed to claim profit" };
    }
};

// Generate daily profits (admin)
const generateDailyProfits = async () => {
    try {
        const response = await axios.post(`${profitUrl}/generate-daily`);
        return response.data;
    } catch (error) {
        console.error("Error generating daily profits:", error);
        return error.response?.data || { success: false, message: "Failed to generate daily profits" };
    }
};

export {
    getAllProfits,
    getProfitsByUserId,
    claimProfit,
    generateDailyProfits
};
