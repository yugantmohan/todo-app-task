import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    navigate('/dashboard');
  };

  const signup = async (email: string, password: string) => {
    await apiClient.post('/auth/signup', { email, password });
    await login(email, password);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const refreshAccessToken = async () => {
    try {
      const res = await apiClient.post('/auth/refresh');
      setAccessToken(res.data.accessToken);
      localStorage.setItem('accessToken', res.data.accessToken);
    } catch {
      setAccessToken(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setAccessToken(token);
    else refreshAccessToken();
  }, []);

  useEffect(() => {
    apiClient.interceptors.request.use((config) => {
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, login, signup, logout, isAuthenticated: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
