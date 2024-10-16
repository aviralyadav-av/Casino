const mongoose = require('mongoose'); // Import the Mongoose library

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,    // Field to store the username
    required: true,  // The username field is required; validation ensures it is provided
    unique: true     // The username must be unique across the collection; validation ensures no duplicates
  },
  password: {
    type: String,    // Field to store the password
    required: true   // The password field is required; validation ensures it is provided
  },
  role: {
    type: String,               // Field to store the user role
    enum: ['admin', 'user'],    // The role must be either 'admin' or 'user'
    default: 'user'             // Default role is 'user' if no role is specified
  }
});

// Create and export the User model based on the userSchema
module.exports = mongoose.model('User', userSchema);
