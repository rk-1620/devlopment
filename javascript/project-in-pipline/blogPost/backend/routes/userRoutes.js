const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware");
const { details } = require("../controllers/userController");

const router = express.Router();

// router.get("/getAllBlogs", getAllBlogs); // Public route - Fetch all blogs
router.get("/details", details);
module.exports = router;