import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Ensures cookies (refreshToken) are sent
});

export default apiClient;
