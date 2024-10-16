const mongoose = require('mongoose');

// Define the schema for the Bonus model
const bonusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId, // This field will store the ObjectId of the referenced Game
    ref: 'Game', // This tells Mongoose to use the 'Game' model for reference
 
  }
});

// Create and export the Bonus model based on the bonusSchema
module.exports = mongoose.model('Bonus', bonusSchema);
