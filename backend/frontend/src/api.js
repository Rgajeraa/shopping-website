import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, 
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        "Connection error. Make sure backend is running on port 5000"
      );
    }
    return Promise.reject(error);
  }
);

export default API;
