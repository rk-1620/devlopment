import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function AdminDashboard()
{
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);

    const adminToken = localStorage.getItem('adminToken');

    useEffect(()=>{
        if(!adminToken)
        {
            navigate("/admin/login")
        }

        const fetchData = async ()=>{
            const config = {headers:{Authorization:`Bearer ${adminToken}`}};
            const userRes = await axios.get('/api/admin/users', config);
            const blogRes = await axios.get('/api/admin/blogs', config);

            setUsers(userRes);
            setBlogs(blogRes);

        };
        
        fetchData();
     }, [adminToken]);  

     const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
          await axios.delete(`/api/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          setUsers(users.filter((u) => u._id !== id));
        }
      };
    
      const handleDeleteBlog = async (id) => {
        if (window.confirm('Delete this blog?')) {
          await axios.delete(`/api/admin/blog/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          setBlogs(blogs.filter((b) => b._id !== id));
        }
      };
    
      return (
        <div>
          <h1>Admin Dashboard</h1>
    
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} - {user.email}
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </li>
            ))}
          </ul>
    
          <h2>Blogs</h2>
          <ul>
            {blogs.map((blog) => (
              <li key={blog._id}>
                {blog.title} by {blog.user?.name}
                <button onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default AdminDashboard