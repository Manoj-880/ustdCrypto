import axios from "axios";
import { url } from "../constants";

const userLogin = async (payload) => {
    try {
        console.log('🚀 Making API call to login:', `${url}/login`, payload);
        let response = await axios.post(`${url}/login`, payload);
        console.log('✅ Login response:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Login error:', error);
        return error.response?.data || { success: false, message: "Network error" };
    }
}

const adminLogin = async (payload) => {
    try {
        let response = await axios.post(`${url}/login/admin`, payload);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export { userLogin, adminLogin };