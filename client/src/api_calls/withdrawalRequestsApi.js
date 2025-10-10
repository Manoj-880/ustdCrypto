import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/withdrawal-requests`;

const getAllRequests = async () => {
  try {
    let response = await axios.get(`${fileUrl}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getRequestDataById = async (id) => {
  try {
    const response = await axios.get(`${fileUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const rejectWithdrawalRequest = async (id, remarks) => {
  try {
    const response = await axios.put(`${fileUrl}/${id}/reject`, { remarks });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

const approveWithdrawalRequest = async (id, transactionId) => {
  try {
    const response = await axios.put(`${fileUrl}/${id}/approve`, { transactionId });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

const verifyTransaction = async (id, transactionId) => {
  try {
    const response = await axios.put(`${fileUrl}/${id}/verify`, { transactionId });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "Network error" };
  }
};

export { 
  getAllRequests, 
  getRequestDataById, 
  rejectWithdrawalRequest, 
  approveWithdrawalRequest, 
  verifyTransaction 
};
