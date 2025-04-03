import React, { useState, useEffect } from "react";
import "./UserReview.css";
import { assets } from "../../assets/assets";

const API_URL = "http://localhost:5000/reviews"; // Backend API

const UserReview = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", review: "" });

  // Fetch reviews from MongoDB on component mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  // Handle input changes for the new review
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Handle form submission for new review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.review) {
      const reviewData = { ...newReview, image: assets.defaultUser };

      // Send the new review to the backend
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })
        .then((res) => res.json())  // Expecting the new review as a response
        .then((data) => {
          setReviews([...reviews, data]); // Update UI with new review
          setNewReview({ name: "", review: "" }); // Reset form
        })
        .catch((err) => console.error("Error adding review:", err));
    }
  };

  return (
    <div className="user-review" id="user-review">
      <h2>What Our Customers Say</h2>
      <div className="review-container">
        {reviews.length > 0 ? (
          reviews.map((user, index) => (
            <div className="review-card" key={index}>
              <img
                src={user.image || assets.defaultUser}
                alt={user.name}
                className="user-image"
              />
              <h3>{user.name}</h3>
              <p>"{user.review}"</p>
            </div>
          ))
        ) : (
          <p>No reviews available yet.</p>
        )}
      </div>
      <div className="review-form">
        <h3>Leave a Review</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={newReview.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="review"
            placeholder="Your Review"
            value={newReview.review}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default UserReview;
