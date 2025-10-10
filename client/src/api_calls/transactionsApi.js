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

export { getAllTransactions };
