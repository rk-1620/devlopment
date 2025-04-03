// ===========================
// SERVER.JS - ENTRY POINT
// ===========================

// Load environment variables from .env file
// This allows us to keep sensitive configuration (like DB credentials) outside the code
require("dotenv").config();

// Import required modules
const http = require("http"); // Built-in Node.js module for creating an HTTP server
const app = require("./app"); // Import the Express app instance from app.js
const connectDB = require("./config/db"); // Import the MongoDB connection function

// ===========================
// DATABASE CONNECTION
// ===========================

// Connect to MongoDB using the function from db.js
// Ensures the database is connected before starting the server
connectDB();

// ===========================
// SERVER CONFIGURATION
// ===========================

// Define the port for the server (use the value from .env file if available, otherwise default to 5000)
const PORT = process.env.PORT;

// Create an HTTP server and pass the Express app to handle requests
const server = http.createServer(app);

// ===========================
// START THE SERVER
// ===========================

// Start listening for incoming connections on the defined port
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
