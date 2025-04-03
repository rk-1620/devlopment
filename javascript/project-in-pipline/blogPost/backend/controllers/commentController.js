const Comment = require("../models/commentModel");
const Blog = require("../models/blog");

// @desc Add a new comment
// @route POST /api/comments/:blogId
// @access Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { blogId } = req.params;

        // Validate input
        if (!text || !blogId) {
            return res.status(400).json({ message: "Text and blog ID are required" });
        }

        // Check authentication
        if (!req.user?._id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Verify blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Create comment
        const comment = await Comment.create({
            post: blogId,  // Matches model field name
            user: req.user._id,
            text
        });

        // Add comment to blog's comments array (if your Blog model has this)
        // blog.comments.push(comment._id);
        // await blog.save();

        res.status(201).json({
            message: "Comment added successfully",
            comment: {
                _id: comment._id,
                text: comment.text,
                user: req.user._id,
                createdAt: comment.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error adding comment",
            error: error.message 
        });
    }
};

// @desc Get comments for a blog
// @route GET /api/comments/:blogId
// @access Public
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ 
            post: req.params.blogId 
        })
        .populate('user', 'name email')  // Show user details
        .sort({ createdAt: -1 });  // Newest first

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching comments",
            error: error.message 
        });
    }
};

// @desc Delete a comment (Only the owner or admin can delete)
// @route DELETE /api/comments/:commentId
// @access Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check ownership (or admin role)
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Remove comment reference from blog
        await Blog.findByIdAndUpdate(
            comment.post,
            { $pull: { comments: comment._id } }
        );

        await comment.deleteOne();

        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting comment",
            error: error.message 
        });
    }
};

module.exports = { addComment, getComments, deleteComment };
