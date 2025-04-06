import api from '../../src/api'; // Adjust the import path as necessary

const getAllBlogs = async () => {
  const response = await api.get('/blogs/getAllBlogs');
  return response.data;
};

const getUserBlogs = async () => {
  const response = await api.get('/blogs/my-blogs');
  return response.data;
};

const getBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

const createBlog = async (blogData) => {
  const response = await api.post('/blogs', blogData);
  return response.data;
};

const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blogs/${id}`, blogData);
  return response.data;
};

const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

export default {
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};