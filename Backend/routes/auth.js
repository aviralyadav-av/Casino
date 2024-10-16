const express = require('express');
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords
const jwt = require('jsonwebtoken'); // Library for creating and verifying JSON Web Tokens (JWT)
const User = require('../models/User'); // Importing the User model
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key'; // This should be stored securely, not hardcoded

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from the request body

  try {
    // Find the user by username in the database
    const user = await User.findOne({ username });
    if (!user) {
      // If user is not found, respond with a 400 Bad Request error
      return res.status(400).send('Invalid credentials');
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // If the password does not match, respond with a 400 Bad Request error
      return res.status(400).send('Invalid credentials');
    }

    // Generate a JWT with the user's ID and role as payload, set to expire in 1 hour
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the JWT
    res.json({ token });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).send('Server error');
  }
});

module.exports = router; // Exporting the router
