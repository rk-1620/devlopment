const express = require("express");
const { getAllBlogs, createBlog, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getAllBlogs", getAllBlogs); // Public route - Fetch all blogs
router.post("/createBlog", authMiddleware.userauth, createBlog); // Protected route - Only logged-in users can create a blog
router.get("/getBlogById/:id", authMiddleware.userauth,getBlogById);
router.post("/updateBlog/:id", authMiddleware.userauth,updateBlog);
router.post("/deleteBlog/:id", authMiddleware.userauth,deleteBlog);
module.exports = router;