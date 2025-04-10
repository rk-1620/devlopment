import authService from '../services/authServices';
import axios from 'axios'
import { createContext, useState } from "react";
import { useEffect } from 'react';

export const AuthContext = createContext(); // Creating the context

export const AuthProvider = ({ children })=> {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const currentUser = authService.getCurrentUser();
        // console.log('Current useAuth user:', currentUser); // Debugging line
        if (isAuthenticated) {
        //   setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [isAuthenticated]);

  const login = async (credentials) => {
    try {
      console.log("useAuth credentials",credentials); // Debugging line
      const data = await authService.login(credentials);
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
    const data = await authService.register(userData);
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
        setIsAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// export const useAuth = () => useContext(AuthContext);