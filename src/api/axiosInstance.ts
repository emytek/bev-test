import axios from "axios";

const API_BASE_URL = "http://35.177.236.20:3006";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }, 
});

export default axiosInstance;
