import axios from "axios";
import { url } from "../constants";

const getUserReferrals = async (userId) => {
    try {
        const response = await axios.get(`${url}/users/${userId}/referrals`);
        return response.data;
    } catch (error) {
        console.error("Error in getUserReferrals:", error);
        return error.response?.data || { success: false, message: "Network error" };
    }
};

export { getUserReferrals };

