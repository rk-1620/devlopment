// app.js

// Importing required modules
const express = require("express"); // Express framework for handling HTTP requests
const cors = require("cors"); // Allows cross-origin requests (useful for frontend-backend communication)
const helmet = require("helmet"); // Enhances security by setting HTTP headers
const morgan = require("morgan"); // Logs HTTP requests to the console (useful for debugging)
const dbCheckRoute = require("./routes/dbCheck"); // Importing the route for checking DB connection

const errorMiddleware = require("./middleware/errorMiddleware");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

// Creating an Express app instance
const app = express();

// =========================
// MIDDLEWARE CONFIGURATION
// =========================

// Enable Cross-Origin Resource Sharing (CORS)
// This allows frontend applications from different origins to communicate with our backend
app.use(cors());

// Use Helmet to secure the app by setting various HTTP headers
// Helps prevent common security vulnerabilities like XSS, clickjacking, etc.
app.use(helmet());

// Use Morgan to log HTTP requests in the console
// The "dev" format provides concise output with method, status, response time, etc.
app.use(morgan("dev"));

// Enable parsing of JSON data in request bodies
// This is required to handle JSON payloads in API requests
app.use(express.json());

// Enable parsing of URL-encoded data (useful for form submissions)
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
const { registerUser } = require("./controllers/authController");

app.use(bodyParser.urlencoded({ extended: true }));

// =========================
// ROUTE DEFINITIONS
// =========================

// Define API routes
// All routes inside "dbCheckRoute" will be prefixed with "/api"
app.use("/api", dbCheckRoute);
app.use("/api/blogs", blogRoutes);  // Blog routes
app.use("/api/auth", authRoutes);    // Authentication routes
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);

// Global Error Handling Middleware
app.use(errorMiddleware);



// =========================
// EXPORT APP INSTANCE
// =========================

// Export the app instance to be used in server.js
// This allows a clean separation between the Express application and the server setup
module.exports = app;
