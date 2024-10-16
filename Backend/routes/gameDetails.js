const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const GameDetails = require("../models/GameDetails");
const Game = require("../models/Game");
const Bonus = require("../models/Bonus");
const { useInRouterContext } = require("react-router-dom");

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  // Define the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Define the filename for the uploaded file to ensure uniqueness
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

// Route to add game details
router.post("/add_details", upload.single("image"), async (req, res) => {
  try {
    // Extracting game details from the request body
    const { title, description, rtp, minimumDeposit, games, bonuses } =
      req.body;

    // Convert RTP to a float. Default to 0 if parsing fails.
    const parsedRtp = parseFloat(rtp) || 0;
    // Ensure minimumDeposit is a string, default to empty string if not provided.
    const parsedMinimumDeposit = minimumDeposit || "";

    // Initialize arrays for parsed game and bonus names
    let parsedGames = [];
    let parsedBonuses = [];

    // Attempt to parse JSON arrays for games and bonuses
    try {
      parsedGames = games ? JSON.parse(games) : [];
      parsedBonuses = bonuses ? JSON.parse(bonuses) : [];
    } catch (parseError) {
      // Return an error if JSON parsing fails
      console.error("Error parsing games or bonuses:", parseError);
      return res
        .status(400)
        .json({ error: "Invalid JSON format for games or bonuses." });
    }

    // Query the database for existing games and bonuses
    const existingGames = await Game.find({ name: { $in: parsedGames } });
    const existingBonuses = await Bonus.find({ name: { $in: parsedBonuses } });

    // Map the found games and bonuses to their IDs
    const validGameIds = existingGames.map((game) => game._id);
    const validBonusIds = existingBonuses.map((bonus) => bonus._id);

    // Validate that all provided game and bonus names were found in the database
    if (
      parsedGames.length !== validGameIds.length ||
      parsedBonuses.length !== validBonusIds.length
    ) {
      return res
        .status(400)
        .json({ error: "Invalid game or bonus names provided." });
    }

    // Create a new GameDetails document with the provided data
    const newGameDetails = new GameDetails({
      image: req.file ? req.file.path : "", // Store the path to the uploaded file
      title: title || "", // Set the title or default to an empty string
      description: description || "", // Set the description or default to an empty string
      rtp: parsedRtp, // Store the parsed RTP value
      minimumDeposit: parsedMinimumDeposit, // Store the parsed minimum deposit
      games: validGameIds, // Store the IDs of valid games
      bonuses: validBonusIds, // Store the IDs of valid bonuses
    });

    // Save the new GameDetails document to the database
    const savedGameDetails = await newGameDetails.save();
    // Respond with the saved document and a success status
    res.status(201).json(savedGameDetails);
  } catch (error) {
    // Log and respond with an error if something goes wrong
    console.error("Error submitting game details:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      details: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : [],
    });
  }
});

// Route to get game details
router.get("/get_details", async (req, res) => {
  const { gameId, bonusId } = req.query;

  // Log the received query parameters for debugging
  console.log("Received query parameters:", { gameId, bonusId });

  try {
    let query = {};

    // If both gameId and bonusId are provided, search for specific game details
    if (gameId && bonusId) {
      // Convert query parameters to MongoDB ObjectId instances
      let gameObjectId, bonusObjectId;
      try {
        gameObjectId = new mongoose.Types.ObjectId(gameId);
        bonusObjectId = new mongoose.Types.ObjectId(bonusId);
      } catch (err) {
        return res
          .status(400)
          .json({ error: "Invalid gameId or bonusId format" });
      }

      // Build query to find documents that match both gameId and bonusId
      query = {
        games: gameObjectId,
        bonuses: bonusObjectId,
      };
    } else if (gameId) {
      // If only gameId is provided, search for documents with the gameId
      let gameObjectId;
      try {
        gameObjectId = new mongoose.Types.ObjectId(gameId);
      } catch (err) {
        return res.status(400).json({ error: "Invalid gameId format" });
      }

      // Build query to find documents that match the gameId
      query = { games: gameObjectId };
    } else if (bonusId) {
      // If only bonusId is provided, search for documents with the bonusId
      let bonusObjectId;
      try {
        bonusObjectId = new mongoose.Types.ObjectId(bonusId);
      } catch (err) {
        return res.status(400).json({ error: "Invalid bonusId format" });
      }

      // Build query to find documents that match the bonusId
      query = { bonuses: bonusObjectId };
    }

    // Find game details based on the built query
    const gameDetails = await GameDetails.find(query);

    if (gameDetails.length === 0) {
      // Return a 404 error if no game details are found
      console.log("No game details found for the specified criteria");
      return res
        .status(404)
        .json({ error: "No game details found for the specified criteria" });
    }

    // Respond with the found game details and a success status
    res.status(200).json(gameDetails);
  } catch (error) {
    // Log and respond with an error if something goes wrong
    console.error("Error fetching game details:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});
router.get("/main_objects", async (req, res) => {
  try {
    const mainObjects = await GameDetails.find()
      .populate("games")
      .populate("bonuses");

    res.json(mainObjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update_details/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description, rtp, minimumDeposit, games, bonuses } = req.body;

  const parsedRtp = parseFloat(rtp) || 0;
  const parsedMinimumDeposit = minimumDeposit || "";

  try {
    let gameDetails = await GameDetails.findById(id);

    if (!gameDetails) {
      return res.status(404).json({ error: "Game details not found." });
    }

    gameDetails.title = title || gameDetails.title;
    gameDetails.description = description || gameDetails.description;
    gameDetails.rtp = parsedRtp;
    gameDetails.minimumDeposit = parsedMinimumDeposit;

    // Update games
    if (games) {
      const gamesArray = Array.isArray(games) ? games : JSON.parse(games);
      const updatedGames = await Promise.all(
        gamesArray.map(async (game) => {
          if (typeof game === "string") {
            let existingGame = await Game.findOne({ name: game });
            if (!existingGame) {
              existingGame = new Game({ name: game });
              await existingGame.save();
            }
            return existingGame._id;
          } else if (game._id) {
            await Game.findByIdAndUpdate(game._id, { name: game.name });
            return game._id;
          }
        })
      );
      gameDetails.games = updatedGames;
    }

    // Update bonuses
    if (bonuses) {
      const bonusesArray = Array.isArray(bonuses)
        ? bonuses
        : JSON.parse(bonuses);
      const updatedBonuses = await Promise.all(
        bonusesArray.map(async (bonus) => {
          if (typeof bonus === "string") {
            let existingBonus = await Bonus.findOne({ name: bonus });
            if (!existingBonus) {
              existingBonus = new Bonus({ name: bonus });
              await existingBonus.save();
            }
            return existingBonus._id;
          } else if (bonus._id) {
            await Bonus.findByIdAndUpdate(bonus._id, { name: bonus.name });
            return bonus._id;
          }
        })
      );
      gameDetails.bonuses = updatedBonuses;
    }

    // Update the image if a new file was uploaded
    if (req.file) {
      gameDetails.image = req.file.path;
    }

    // Save the updated GameDetails document
    await gameDetails.save();

    // Fetch the updated document with populated games and bonuses
    const updatedGameDetails = await GameDetails.findById(id)
      .populate("games", "name")
      .populate("bonuses", "name");

    res.status(200).json(updatedGameDetails);
  } catch (error) {
    console.error("Error updating game details:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      details: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : [],
    });
  }
});

// Route to delete game details
router.delete("/delete_details/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the route parameters

  try {
    // Find and delete the GameDetails document by ID
    const deletedGameDetails = await GameDetails.findByIdAndDelete(id);

    if (!deletedGameDetails) {
      return res.status(404).json({ error: "Game details not found." });
    }

    // Respond with a success status and the deleted document
    res.status(200).json({
      message: "Game details successfully deleted.",
      deletedGameDetails,
    });
  } catch (error) {
    // Log and respond with an error if something goes wrong
    console.error("Error deleting game details:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

// Route to clone game details
router.post("/clone_details/:id", async (req, res) => {
  try {
    // Fetch the existing game detail by ID
    const existingDetail = await GameDetails.findById(req.params.id).populate(
      "games bonuses"
    );

    if (!existingDetail) {
      return res.status(404).json({ error: "Game detail not found." });
    }

    // Clone the detail object and append '(Clone)' to the title
    const clonedDetail = existingDetail.toObject();
    clonedDetail._id = undefined; // Remove the _id field to create a new document
    clonedDetail.title = `${existingDetail.title} (Clone)`;

    // Optionally, you can clone associated games and bonuses as well
    // Here we assume you want to keep the same games and bonuses, but create new references
    const clonedGames = await Promise.all(
      existingDetail.games.map(async (game) => {
        const clonedGame = game.toObject();
        clonedGame._id = undefined; // Remove the _id field
        const newGame = new Game(clonedGame);
        return newGame.save();
      })
    );

    const clonedBonuses = await Promise.all(
      existingDetail.bonuses.map(async (bonus) => {
        const clonedBonus = bonus.toObject();
        clonedBonus._id = undefined; // Remove the _id field
        const newBonus = new Bonus(clonedBonus);
        return newBonus.save();
      })
    );

    clonedDetail.games = clonedGames.map((game) => game._id);
    clonedDetail.bonuses = clonedBonuses.map((bonus) => bonus._id);

    // Create a new GameDetails document with the cloned data
    const newClonedDetail = new GameDetails(clonedDetail);
    const savedClonedDetail = await newClonedDetail.save();

    res.status(201).json(savedClonedDetail);
  } catch (error) {
    console.error("Error cloning game detail:", error);
    res.status(500).json({ error: "Failed to clone game detail." });
  }
});

module.exports = router;
