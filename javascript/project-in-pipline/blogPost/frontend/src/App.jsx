// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import MainLayout from './components/layout/MainLayout';
// import HomePage from './pages/home/HomePage';
// import BlogFeed from './pages/blog/BlogFeed';
// import BlogPost from './pages/blog/BlogPost';
// import CreatePost from './pages/blog/CreatePost';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/auth/PrivateRoute';
import HomePage from './pages/home/HomePage'
import { AuthProvider}  from './context/AuthContext';
import CreateBlogPage from './pages/dashboard/CreateBlogPage';
// import EditProfilePage from './pages/profile/EditProfilePage';
import EditBlogPage from './pages/dashboard/EditBlogPage';
import ProfilePage from './pages/profile/userDetail';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import BlogList from './pages/blog/BlogList';
// import CreateBlog from './pages/blog/BlogCreate'
import axios from 'axios';

function App() {
    const API_URL = 'http://localhost:3000/api/auth'; // Update with your backend URL

    // if (process.env.NODE_ENV === 'development') {
    //   const { initJSErrorLogging } = require('../../../../data-collector/loggers/log-js-errors');
    //   initJSErrorLogging();
    // }
    
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/usersName" element={<userName/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/getAllBlogs" element={<BlogList />} />
          {/* Protected routes */}

          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-blog" element={<CreateBlogPage />} />
            <Route path="/edit-blog/:id" element={<EditBlogPage />} />
          </Route> */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Protected Routes - Require Authentication */}
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-blog" element={<CreateBlogPage />} /> */}
            
            {/* Profile Related Routes */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/profile/edit" element={<EditProfilePage />} /> */}
            {/* <Route path="/change-password" element={<ChangePasswordPage />} /> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;