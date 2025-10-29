import axios from "axios";
import { url } from "../constants";

const lockinUrl = `${url}/lockins`;
const lockinPlansUrl = `${url}/lockin-plans`;

// Get all lock-in plans
const getAllLockinPlans = async () => {
    try {
        const response = await axios.get(lockinPlansUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching lock-in plans:", error);
        return error.response?.data || { success: false, message: "Failed to fetch lock-in plans" };
    }
};

// Get lock-in plan by ID
const getLockinPlanById = async (id) => {
    try {
        const response = await axios.get(`${lockinPlansUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching lock-in plan with ID ${id}:`, error);
        return error.response?.data || { success: false, message: "Failed to fetch lock-in plan" };
    }
};

// Get next lock-in name
const getNextLockinName = async () => {
    try {
        const response = await axios.get(`${lockinUrl}/next-name`);
        return response.data;
    } catch (error) {
        console.error("Error fetching next lock-in name:", error);
        return error.response?.data || { success: false, message: "Failed to fetch next lock-in name" };
    }
};

// Get all lock-ins
const getAllLockins = async () => {
    try {
        const response = await axios.get(lockinUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching lock-ins:", error);
        return error.response?.data || { success: false, message: "Failed to fetch lock-ins" };
    }
};

// Get lock-ins by user ID
const getLockinsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${lockinUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching lock-ins for user ${userId}:`, error);
        return error.response?.data || { success: false, message: "Failed to fetch user lock-ins" };
    }
};

// Create new lock-in
const createLockin = async (payload) => {
    try {
        const response = await axios.post(lockinUrl, payload);
        return response.data;
    } catch (error) {
        console.error("Error creating lock-in:", error);
        return error.response?.data || { success: false, message: "Failed to create lock-in" };
    }
};

// Delete lock-in
const deleteLockin = async (id) => {
    try {
        const response = await axios.delete(`${lockinUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting lock-in with ID ${id}:`, error);
        return error.response?.data || { success: false, message: "Failed to delete lock-in" };
    }
};

// Create new lock-in plan
const createLockinPlan = async (payload) => {
    try {
        const response = await axios.post(lockinPlansUrl, payload);
        return response.data;
    } catch (error) {
        console.error("Error creating lock-in plan:", error);
        return error.response?.data || { success: false, message: "Failed to create lock-in plan" };
    }
};

// Update lock-in plan
const updateLockinPlan = async (id, payload) => {
    try {
        const response = await axios.put(`${lockinPlansUrl}/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error(`Error updating lock-in plan with ID ${id}:`, error);
        return error.response?.data || { success: false, message: "Failed to update lock-in plan" };
    }
};

// Delete lock-in plan
const deleteLockinPlan = async (id) => {
    try {
        const response = await axios.delete(`${lockinPlansUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting lock-in plan with ID ${id}:`, error);
        return error.response?.data || { success: false, message: "Failed to delete lock-in plan" };
    }
};

export {
    getAllLockinPlans,
    getLockinPlanById,
    getAllLockins,
    getLockinsByUserId,
    createLockin,
    deleteLockin,
    createLockinPlan,
    updateLockinPlan,
    deleteLockinPlan,
    getNextLockinName
};
