import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/transactions`;

const getAllTransactions = async () => {
  try {
    let response = await axios.get(`${fileUrl}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getTransactionsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${fileUrl}/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

export { getAllTransactions, getTransactionsByUserId };
