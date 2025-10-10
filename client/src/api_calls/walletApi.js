import axios from "axios";
import { url } from "../constants";

const fileUrl = `${url}/wallets`;

const getAllWallets = async () => {
  try {
    const response = axios.get(fileUrl);
    return (await response).data;
  } catch (error) {
    console.log(error);
  }
};

const addWalletId = async (payload) => {
  try {
    const response = await axios.post(fileUrl, payload);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const updateWallet = async (id) => {
  try {
    const response = await axios.put(`${fileUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getAllWallets, addWalletId, updateWallet };
