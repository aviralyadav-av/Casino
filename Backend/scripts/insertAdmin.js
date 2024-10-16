const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1/admin-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Function to insert an admin user into the database
const insertAdmin = async () => {
  // Define the password for the admin user
  const password = 'adminpassword';
  
  // Hash the password using bcrypt for secure storage
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new User instance with the hashed password and admin role
  const admin = new User({
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  });

  // Save the admin user to the database
  await admin.save();
  
  // Log a success message to the console
  console.log('Admin user inserted');
  
  // Disconnect from the database after the operation is complete
  mongoose.disconnect();
};

// Execute the insertAdmin function and handle any errors
insertAdmin().catch(err => {
  // Log any errors that occur during the insertion
  console.error('Error inserting admin user:', err);
  
  // Ensure the database connection is closed in case of an error
  mongoose.disconnect();
});
