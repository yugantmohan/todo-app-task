const API_URL = import.meta.env.VITE_API_URL

// Application configuration
const config = {
  // API URLs
  apiUrl: `${API_URL}/api`, // Change this when deploying
  
  // Auth settings
  authTokenKey: 'accessToken',
  userEmailKey: 'userEmail',
  
  // Todo settings
  defaultTodoLimit: 50
};

export default config;
