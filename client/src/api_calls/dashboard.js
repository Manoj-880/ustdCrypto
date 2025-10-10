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

export { adminDashboard };
