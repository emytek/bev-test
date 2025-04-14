import axios from "axios";

const API_BASE_URL = "https://addon.wyzeng.com:3006/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
