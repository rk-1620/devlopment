const express = require("express");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const { userauth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:blogId", userauth, addComment); // Add a comment
router.get("/:blogId", getComments); // Get all comments for a blog
router.delete("/:commentId", userauth, deleteComment); // Delete a comment

module.exports = router;
