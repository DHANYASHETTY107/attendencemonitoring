import axios from "axios";

const getApiBaseUrl = () => {
  if (window.electronAPI?.apiBaseUrl) {
    return window.electronAPI.apiBaseUrl;
  }

  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  return "http://127.0.0.1:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Automatically attach JWT token
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;

  }
  return req;
});

export default api;





