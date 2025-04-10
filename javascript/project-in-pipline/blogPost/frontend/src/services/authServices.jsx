import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';


const API_URL = 'http://localhost:3000/api/auth'; // Update with your backend URL
// const navigate = useNavigate();
// const { isAuthenticated } = useContext(AuthContext);

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    // localStorage.setItem('user', response.data.user);
    localStorage.setItem('email', response.data.email);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    // localStorage.setItem('user', JSON.stringify(response.data.user));
    // localStorage.setItem('email', response.data.email);

  }
  return response.data;
};

// const login = async (userData) => {
//   console.log('authservice Login userData:', userData); // Debugging line
//   const response = await axios.post(`${API_URL}/login`, userData);
  
//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//     console.log('authservice Login response data:', response.data); // Debugging line

//     // 🛑 Fix: Ensure `response.data.user.email` exists before storing
//     if (response.data.user.email) {
//       localStorage.setItem('email', response.data.email);  // ✅ Fix here
//     } else {
//       console.error("Email not found in response data:", response.data);
//     }
//   }
  
//   return response.data;
// };


const logout = () => {
  
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  // const { isAuthenticated, setIsAuthenticated } = useAuth();
  // setIsAuthenticated(false);
  delete axios.defaults.headers.common["Authorization"];
  // navigate('/dashboard');
  // navigate("/login");
};
// console.log('localStorage user:', localStorage.getItem('user'));
console.log('localStorage email:', localStorage.getItem('email'));
console.log('localStorage token:', localStorage.getItem('token'));

const getCurrentUser = () => {
  return localStorage.getItem('email');
};
// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem());
// };
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;