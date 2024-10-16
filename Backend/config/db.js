// Import required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Log success message if connection is established
    console.log('MongoDB connected');
  } catch (err) {
    // If connection fails, log the error message
    console.error(err.message);
    // Exit the process with a failure code
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;