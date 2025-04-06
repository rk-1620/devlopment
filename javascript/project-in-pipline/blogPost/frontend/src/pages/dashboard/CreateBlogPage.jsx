import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../blog/BlogForm';
// agar import default hai to curly bracket use nai krte
import useBlogs from '../../hooks/useBlogs';
// import { useNavigate } from 'react-router-dom';
// import { useBlogs } from '../hooks/useBlogs';
// import BlogForm from '../components/BlogForm';
import { Container, Typography } from '@mui/material';

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const { createNewBlog } = useBlogs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      await createNewBlog(blogData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Blog
      </Typography>
      <BlogForm 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Container>
  );
}