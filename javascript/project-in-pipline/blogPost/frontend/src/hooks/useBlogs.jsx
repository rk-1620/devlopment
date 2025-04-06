import { useState, useEffect, use } from 'react';
import blogServices from '../services/blogServices'; 
import userServices from '../services/userServices';

export default function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogServices.getAllBlogs();
     
      // Log the fetched blogs for debugging
      // console.log("Fetched blogs:", blogsWithUserDetails);
      // console.log("Fetched blogs:", data); 
      console.log("Fetched blogs:", data);
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogServices.getUserBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewBlog = async (blogData) => {
    try {
      const newBlog = await blogServices.createBlog(blogData);
      setBlogs([newBlog, ...blogs]);
      return newBlog;
    } catch (err) {
      throw err;
    }
  };

  const updateExistingBlog = async (id, blogData) => {
    try {
      const updatedBlog = await blogServices.updateBlog(id, blogData);
      setBlogs(blogs.map(blog => blog._id === id ? updatedBlog : blog));
      return updatedBlog;
    } catch (err) {
      throw err;
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogServices.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    fetchUserBlogs,
    createNewBlog,
    updateExistingBlog,
    deleteBlog,
  };
}