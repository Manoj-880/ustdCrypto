import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/admin/deposit-names`;

const getAllDepositNames = async () => {
  try {
    const response = await axios.get(fileUrl);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Failed to fetch deposit names" };
  }
};

const createDepositName = async (payload) => {
  try {
    const response = await axios.post(fileUrl, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Failed to create deposit name" };
  }
};

const deleteDepositName = async (id) => {
  try {
    const response = await axios.delete(`${fileUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Failed to delete deposit name" };
  }
};

export { getAllDepositNames, createDepositName, deleteDepositName };
