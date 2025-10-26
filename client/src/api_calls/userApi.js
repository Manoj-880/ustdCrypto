import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/users`;

const getAllUsers = async () => {
    try {
        let response = await axios.get(fileUrl);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

const getUserById = async (id) => {
    try {
        let response = await axios.get(`${fileUrl}/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

const createUser = async (payload) => {
    try {
        console.log('🚀 Making API call to create user:', fileUrl, payload);
        let response = await axios.post(fileUrl, payload);
        console.log('✅ User creation response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ User creation error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
}

const updateUser = async (id, payload) => {
    try {
        let response = await axios.put(`${fileUrl}/${id}`, payload);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

const deleteUser = async (id) => {
    try {
        let response = await axios.delete(`${fileUrl}/${id}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return error.response.data;
    }
}

const addBalance = async (userId, amount, reason) => {
    try {
        const response = await axios.post(`${url}/admin/add-balance`, {
            userId,
            amount,
            reason
        });
        console.log('Add balance response:', response.data);
        return response.data;
    } catch (error) {
        console.log('Add balance error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser, addBalance };