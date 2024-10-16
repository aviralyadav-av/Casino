const express = require("express");
const router = express.Router();
const Game = require("../models/Game"); // Importing the Game model

// Route to add a new game
router.post("/add", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const newGame = new Game({ name });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get all games
router.get("/all", async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to remove a game by ID
router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json({ message: "Game removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Route to update a game by ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const updatedGame = await Game.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
