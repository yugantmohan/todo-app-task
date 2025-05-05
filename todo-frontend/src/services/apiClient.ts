
import axios from 'axios';
import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_API_URL


// Create axios instance with base URL and credentials
const apiClient = axios.create({
  baseURL: `${API_URL}/api`, // Your backend URL
  withCredentials: true,
});

// Track if we're already refreshing the token
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: any[] = [];

// Process the failed queue
const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or it's a refresh token request that failed, reject
    if (error.response?.status !== 401 || originalRequest.url === '/api/auth/refresh' || originalRequest._retry) {
      // For specific status codes, provide user-friendly toast messages
      if (error.response?.status === 404) {
        toast.error('Resource not found. Please try again later.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Our team has been notified.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this resource.');
      } else if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network.');
      }
      
      return Promise.reject(error);
    }
    
    // Mark this request as retried to prevent infinite loops
    originalRequest._retry = true;
    
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        // Call the refresh token endpoint
        const { data } = await axios.post('/api/auth/refresh', {}, {
          baseURL: `${API_URL}`,
          withCredentials: true // Important for sending the refresh token cookie
        });
        
        // Update access token in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        
        // Show a subtle notification about token refresh
        toast.info('Session refreshed', {
          duration: 2000,
          position: 'bottom-right',
        });
        
        // Update authorization header for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        
        // Process queue and retry original request
        processQueue();
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, reject all queued requests
        processQueue(refreshError);
        
        // Clear token and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Show error message
        toast.error('Your session has expired. Please log in again.');
        
        // Redirect to login is handled by the AuthContext
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
  }
);

// Request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
