import authService from '../services/authServices';
import axios from 'axios'
import { createContext, useState } from "react";
import { useEffect } from 'react';

export const AuthContext = createContext(); // Creating the context

export const AuthProvider = ({ children })=> {
  const [isToken, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // const { detailUser } = useAuth();
  const [allDetails, setAllDetails] = useState(null); // Initialize state for allDetails
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const currentUser = authService.getCurrentUser();
        // console.log(currentUser);
        // console.log('Current useAuth user:', currentUser); // Debugging line
        if (isToken) {
          // setUser(currentUser);
          setIsAuthenticated(true);
        }
        else{
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [isToken]);

  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await detailUser(); // Await the async function
          setAllDetails(response.data); // Update state with the result
          // console.log("alldetails from profile page", details);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      fetchUserDetails();
    }, [isAuthenticated]); // Add detailUser to dependency array

  const login = async (credentials) => {
    try {
      console.log("useAuth credentials",credentials); // Debugging line
      const data = await authService.login(credentials);
      console.log("useAuth data",data); // Debugging line
      
  
      if (data.token) {
        // Set token in axios for future requests
        // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
       
        setUser(allDetails);
        setToken(data.token);
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
    setUser(allDetails);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setToken(null)

  };
  const detailUser = async() => {
    const currentUser = await authService.getCurrentUser(isToken);
    console.log(currentUser);
    return currentUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        detailUser,
        login,
        register,
        logout,
        setIsAuthenticated,
        allDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// export const useAuth = () => useContext(AuthContext);