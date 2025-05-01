const Blog = require('../models/blog');
const ApiError = require('../utils/ApiErrors');

const blogService = {
  /**
   * Create a new blog
   */
  createBlog: async (blogData) => {
    try {
      console.log("blog data from blogservices", blogData);
      return await Blog.create(blogData);
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  },

  /**
   * Get blog by ID with populated author and comments
   */
  getBlogById: async (id) => {
    const blog = await Blog.findById(id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        select: 'text createdAt',
        populate: {
          path: 'user',
          select: 'name'
        }
      }).lean({ virtuals: true }); // Important for virtuals to show up;
      // yahan pr error tha kyuki mera blog schema me actual comments field nai tha 
      // isliye virtual comment field banaya gaye isliye ye line of code add krna parega virtaul comments
      // dekhne ke liye
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Get all blogs with filters/pagination
   */
  getAllBlogs: async (filters = {}, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await Blog.find(filters)
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('author', 'name');
  },

  /**
   * Update blog by ID
   */
  updateBlog: async (id, updateData) => {
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Delete blog by ID
   */
  deleteBlog: async (id) => {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Verify blog ownership
   */
  verifyOwnership: async (blogId, userId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, 'Blog not found');
    if (blog.author.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to modify this blog');
    }
    return true;
  }
};

module.exports = blogService;