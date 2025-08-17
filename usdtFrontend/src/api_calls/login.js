import axios from "axios";
import { url } from "../globalParams";

const login = async (data) => {
    try {
        let response = await axios.post(`${url}/login`, data);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

const register = async (data) => {
    try {
        let response = await axios.post(`${url}/users`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export { login, register };