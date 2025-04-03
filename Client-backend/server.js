const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodReviewsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Review schema and model
const reviewSchema = new mongoose.Schema({
  name: String,
  review: String,
});

const Review = mongoose.model('Review', reviewSchema);

// Routes
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/reviews', async (req, res) => {
  const { name, review } = req.body;

  try {
    const newReview = new Review({ name, review });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
