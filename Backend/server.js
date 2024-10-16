const express = require("express");
const bcrypt = require("bcryptjs"); // For hashing and comparing passwords
const jwt = require("jsonwebtoken"); // For generating and verifying JWT tokens
const bodyParser = require("body-parser"); // Middleware for parsing JSON request bodies
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const mongoose = require("mongoose"); // MongoDB object modeling tool
const fs = require("fs"); // File system module for handling file operations
const dotenv = require("dotenv"); // Module for loading environment variables
const path = require("path"); // Module for handling and transforming file paths
const multer = require("multer"); // Middleware for handling multipart/form-data, especially for file uploads
const gameRoutes = require("./routes/gameRoutes"); // Importing game-related routes
const bonusRoutes = require("./routes/bonusRoutes"); // Importing bonus-related routes
const gameDetailsRouter = require("./routes/gameDetails"); // Importing game details routes

dotenv.config(); // Load environment variables from a .env file

const app = express(); // Creating an Express application
const PORT = process.env.PORT || 4000; // Defining the port to listen on
const secretKey = process.env.SECRET_KEY; // Secret key for JWT, loaded from environment variables

// MongoDB setup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Define the directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename as current timestamp + original filename
  },
});
const upload = multer({ storage: storage }); // Initialize multer with the defined storage configuration

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use("/uploads", express.static(uploadsDir)); // Serve static files from the uploads directory

// Admin schema definition
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username field
  password: { type: String, required: true }, // Password field
});

const Admin = mongoose.model("Admin", adminSchema); // Model for the Admin collection

// Function to hash password and save admin
const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10); // Hash the password with a salt factor of 10
  const admin = new Admin({
    username: "admin",
    password: hashedPassword,
  });

  try {
    await admin.save(); // Save the admin user to the database
    console.log("Admin created");
  } catch (err) {
    console.log("Admin already exists or an error occurred");
  }
};

// Uncomment the line below to create the admin initially
// createAdmin();

// Route to login admin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username }); // Find admin by username

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" }); // If admin not found
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password); // Compare provided password with hashed password

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" }); // If password is incorrect
    }

    const token = jwt.sign({ username: admin.username }, secretKey, {
      expiresIn: "1h",
    }); // Generate JWT token
    res.status(200).json({ token }); // Send token as response
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Access denied" }); // If no token is provided
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify the token
    req.user = decoded; // Store decoded token payload in the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token" }); // If token is invalid
  }
};

// Protected route
app.get("/admin", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin area" }); // Responds only if authenticated
});

// Routes setup
app.use("/api/games", gameRoutes); // Routes for game-related API endpoints
app.use("/api/bonus", bonusRoutes); // Routes for bonus-related API endpoints
app.use("/api/details", gameDetailsRouter); // Routes for game details API endpoints

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log message indicating server is running
});
