import axios from "axios";
import { url } from "../globalParams";

const getUserTransactionsById = async (id) => {
    try {
        let response = await axios.get(`${url}/transactions/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserTransactionsById,
}