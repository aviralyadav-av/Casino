const mongoose = require('mongoose');

// Define the schema for game details
const gameDetailsSchema = new mongoose.Schema({
  // URL of the image associated with the game detail
  image: { type: String, required: false },

  // Title of the game detail (required field)
  title: { type: String, required: true },

  // Description of the game detail
  description: { type: String, required: false },

  // Return to player percentage for the game
  rtp: { type: Number, required: false },

  // Minimum deposit required to play the game, stored as a string
  minimumDeposit: { type: String, required: false },

  // References to associated games (array of ObjectIds, linked to 'Game' collection)
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],

  // References to associated bonuses (array of ObjectIds, linked to 'Bonus' collection)
  bonuses:[ { type: mongoose.Schema.Types.ObjectId, ref: 'Bonus' }]
})

// Create a model using the schema
const GameDetails = mongoose.model('GameDetails', gameDetailsSchema);

// Export the model for use in other parts of the application
module.exports = GameDetails;
