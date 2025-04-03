import React, { useState, useEffect } from "react";
import "./UserReview.css";
import { assets } from "../../assets/assets";

const UserReview = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", review: "" });

  // Fetch reviews from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.name && newReview.review) {
      try {
        const response = await fetch("http://localhost:5000/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newReview, image: assets.defaultUser }),
        });

        if (!response.ok) throw new Error("Failed to add review");

        const addedReview = await response.json();
        setReviews([...reviews, addedReview]);
        setNewReview({ name: "", review: "" });
      } catch (error) {
        console.error("Error adding review:", error);
      }
    }
  };

  return (
    <div className="user-review" id="user-review">
      <h2>What Our Customers Say</h2>
      <div className="review-container">
        {reviews.map((user, index) => (
          <div className="review-card" key={index}>
            <img src={user.image || assets.defaultUser} alt={user.name} className="user-image" />
            <h3>{user.name}</h3>
            <p>"{user.review}"</p>
          </div>
        ))}
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
