import { useEffect } from 'react';
import useBlogs from '../../hooks/useBlogs';
import {BlogCard} from '../../components/blog/BlogCard'
import { CircularProgress, Alert, Stack } from '@mui/material';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Navbar } from '../../components/common/AppBar';
import { useAuth } from '../../hooks/useAuth';

export default function BlogList() {
  const { blogs, loading, error, fetchBlogs } = useBlogs();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
        }}>
  {/* <Navbar isAuthenticated={isAuthenticated} user={user} /> */}
    <Stack spacing={2}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </Stack>
    </Box>
  );
}