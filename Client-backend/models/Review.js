const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  image: { type: String, default: "" },
});

module.exports = mongoose.model("Review", ReviewSchema);
