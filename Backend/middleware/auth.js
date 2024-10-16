// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Define the secret key used for JWT signing and verification
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware function for authentication and authorization
const auth = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization').replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    // Verify the token using the secret key
    const verified = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = verified;

    // Check if the user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    // If everything is okay, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid, send an error response
    res.status(400).send('Invalid token');
  }
};

// Export the middleware function for use in other parts of the application
module.exports = auth;