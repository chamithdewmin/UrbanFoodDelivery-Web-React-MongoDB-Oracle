import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(1);
  const { addToCart } = useContext(StoreContext);

  const handleCart = () => {
    addToCart(id, itemCount, price);
    setItemCount(1);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        <div className="food-item-counter">
          <img
            onClick={() => {
              setItemCount((prev) => (prev > 1 ? prev - 1 : 1));
            }}
            src={assets.remove_icon_red}
            alt=""
          />
          <p>{itemCount}</p>
          <img
            onClick={() => {
              setItemCount((prev) => prev + 1);
            }}
            src={assets.add_icon_green}
            alt=""
          />
        </div>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <img src={assets.rating_starts} alt="" />
        <p className="food-item-desc">{description}</p>
        <div className="food-item-actions">
          <p className="food-item-price">Rs: {price}.00</p>
          <button onClick={handleCart} className="food-item-add-to-cart">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
