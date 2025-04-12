const Blog = require("../models/blog");
const mongoose = require("mongoose");
const User = require("../models/User");
// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
    try {
        //it is params not the query
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private (Requires Auth)
const createBlog = async (req, res) => {
    try {
    //   console.log("Authenticated user:", req.user); // Debug log
      console.log("createBlog from backend")
      const title = req.body.title;
      const content = req.body.content;
    //   const author = req.body.author;
    //   const author = new mongoose.Types.ObjectId();  
    const author = req.user._id;
    const name = req.body.name;
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      // Check authentication
    if (!req.user?._id) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      // Use either req.user._id or req.user.id consistently
      const blog = await Blog.create({
        title,
        content,
        author,
        name
      });

      //Add the blog's ID to the user's `blogs` array
    await User.findByIdAndUpdate(
      author,
      { $push: { blogs: blog._id } }, // Add the new blog ID
      { new: true }
    );
    //   const blog = new Blog({
    //     title,
    //     content,
    //     author:(new mongoose.Types.ObjectId(author)), // Now guaranteed to exist
    //   });
    //   const newBlog = await Blog.create(blog);
    //   const savedBlog = await Blog.save();
      res.status(201).json(Blog);
      
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ 
        message: "Server EError", // Fixed message format
        error: error.message 
      });
    }
};

// @desc    Update an existing blog
// @route   PUT /api/blogs/:id
// @access  Private (Requires Auth)
const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (Requires Auth)
const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // Remove the blog ID from the author's `blogs` array
        await User.findByIdAndUpdate(
            deleteBlog.author,
            { $pull: { blogs: blog._id } } // Remove the deleted blog ID
        );
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
