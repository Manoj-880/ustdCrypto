import axios from "axios";
import { url } from "../globalParams";

const getuserDetailsById = async (id) => {
    try {
        let response = await axios.get(`${url}/users/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export { getuserDetailsById};