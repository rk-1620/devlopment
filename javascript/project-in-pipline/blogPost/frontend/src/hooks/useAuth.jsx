import { createContext, useContext, useState, useEffect } from 'react';
import authServices from '../services/authServices';
import axios from 'axios';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authServices.getCurrentUser();
        console.log('Current useAuth user:', currentUser); // Debugging line
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("useAuth credentials",credentials); // Debugging line
      const data = await authServices.login(credentials);
      console.log("useAuth data",data); // Debugging line
  
      if (data.token) {
        // Set token in axios for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // setUser(data.user.email);
        setIsAuthenticated(true);
      } else {
        throw new Error("Login failed: No token received");
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error.message || error.response?.data?.message);
      throw error;
    }
  };

  const register = async (userData) => {
    const data = await authServices.register(userData);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);