const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  const { name, review, image } = req.body;
  if (!name || !review) return res.status(400).json({ error: "All fields are required" });

  try {
    const newReview = new Review({ name, review, image });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
