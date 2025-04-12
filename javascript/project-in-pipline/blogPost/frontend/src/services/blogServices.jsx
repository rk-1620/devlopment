import api from '../../src/api'; // Adjust the import path as necessary

// yahan pr export or import me problem tha 
// jisme named export or default export ka differenece ke wajah se error
// aa raha tha  iss wale code me default export ka use kiya hai 
// default export me sirf ek hi function ko export krte hai

// import krne ka code jo dusra file me use hoga
//import blogService from '../../services/blogService'; // Default import (no curly braces)
// await blogService.createBlog({ blogData, user });

const AllBlogService = {
  // Create a new blog
getAllBlogs : async () => {
  const response = await api.get('/blogs/getAllBlogs');
  return response.data;
},

 getUserBlogs : async () => {
  const response = await api.get('/blogs/my-blogs');
  return response.data;
},

 getBlogById : async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
},

 createBlog : async (blogData,{allDetails}) => {
  console.log("title from blogservices createblog",blogData.title);
  const response = await api.post('/blogs/createBlog', {
    title: blogData.title,
    content: blogData.content,
    name: allDetails.name,    // From global state (e.g., useAuth)
    author: allDetails._id,   // From global state

    // title: "Test Title",
    // content: "Test Content",
    // name: "Test User",
    // author: "test_author_id"
  });
  return response.data;
},

 updateBlog : async (id, blogData) => {
  const response = await api.put(`/blogs/${id}`, blogData);
  return response.data;
},

 deleteBlog : async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
},

};

// export default {
//   getAllBlogs,
//   getUserBlogs,
//   getBlogById,
//   createBlog,
//   updateBlog,
//   deleteBlog,
// };

export default AllBlogService;