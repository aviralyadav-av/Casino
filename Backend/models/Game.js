const mongoose = require('mongoose'); // Import the Mongoose library

// Define the schema for the Game model
const GameSchema = new mongoose.Schema({
  name: {
    type: String,     // The 'name' field is of type String
    required: true,   // The 'name' field is required; validation ensures it is provided
  },
  bonuses: [{        // The 'bonuses' field is an array of ObjectId references
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bonus'     // This tells Mongoose to use the 'Bonus' model for reference
  }]
});

// Create and export the Game model based on the GameSchema
module.exports = mongoose.model('Game', GameSchema);
