import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Ensures cookies (refreshToken) are sent
});

export default apiClient;
