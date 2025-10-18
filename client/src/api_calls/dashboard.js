import axios from "axios";
import { url } from "../constants";

const adminDashboard = async () => {
  try {
    let response = await axios.get(`${url}/dashboard/admin`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const userDashboard = async (userId) => {
  try {
    const response = await axios.get(`${url}/dashboard/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { adminDashboard, userDashboard };
