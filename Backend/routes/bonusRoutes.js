const express = require("express");
const router = express.Router();
const Bonus = require("../models/Bonus"); // Importing the Bonus model

// Route to add a new bonus
router.post("/add_bonus", async (req, res) => {
  const { name } = req.body; // Extracting the 'name' field from the request body
  if (!name) {
    // If 'name' is not provided, send a 400 Bad Request response
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    // Create a new Bonus instance with the provided name
    const newBonus = new Bonus({ name });
    // Save the new Bonus to the database
    await newBonus.save();
    // Send the saved Bonus as a response with a 201 Created status
    res.status(201).json(newBonus);
  } catch (error) {
    // Handle any errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get all bonuses
router.get("/all_bonus", async (req, res) => {
  try {
    // Fetch all bonuses from the database
    const bonuses = await Bonus.find();
    // Send the list of bonuses as a response with a 200 OK status
    res.status(200).json(bonuses);
  } catch (error) {
    // Handle any errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: "Server error" });
  }
});

// Route to remove a bonus by ID
router.delete("/bonus/:id", async (req, res) => {
  try {
    // Find and delete the bonus with the specified ID
    const bonus = await Bonus.findByIdAndDelete(req.params.id);
    if (!bonus) {
      // If no bonus is found, send a 404 Not Found response
      return res.status(404).json({ error: "Bonus not found" });
    }
    // Send a success message with a 200 OK status
    res.status(200).json({ message: "Bonus removed" });
  } catch (error) {
    // Handle any errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update a bonus by ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const updatedBonus = await Bonus.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedBonus) {
      return res.status(404).json({ error: "Bonus not found" });
    }
    res.status(200).json(updatedBonus);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // Exporting the router
