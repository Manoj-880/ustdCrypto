import axios from "axios";
import { url } from "../constants";

const contactUrl = `${url}/contact`;

// Submit contact form
const submitContactForm = async (formData) => {
    try {
        const response = await axios.post(contactUrl, formData);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: "Failed to submit contact form" };
    }
};

export { submitContactForm };
