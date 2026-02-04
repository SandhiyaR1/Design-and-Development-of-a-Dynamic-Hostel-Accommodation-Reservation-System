import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add x-regno header for authentication
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.regNo) {
    config.headers["x-regno"] = user.regNo;
  }
  return config;
});

export default api;
