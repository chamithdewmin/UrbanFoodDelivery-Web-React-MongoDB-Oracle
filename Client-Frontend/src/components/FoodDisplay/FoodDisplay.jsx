import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import axios from "axios";
import SkeletonCard from "../Skelaton/SkeletonCard";

const FoodDisplay = ({ category }) => {
  const { food_list, url } = useContext(StoreContext);

  const [imageUrls, setImageUrls] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let newUrl = url + "/bottle/products";
        const response = await axios.get(newUrl);
        fetchProductsImages(response.data);
        console.log(response.data);
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchProductsImages = (products) => {
      products.forEach((product) => {
        let newUrl = url + `/bottle/product/${product.id}/image`;
        axios
          .get(newUrl, {
            responseType: "blob",
          })
          .then((response) => {
            const imageUrl = URL.createObjectURL(response.data);
            setImageUrls((prevState) => ({
              ...prevState,
              [product.id]: imageUrl,
            }));
          })
          .catch((error) => {
            console.error("Error fetching product image:", error);
          });
      });
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="food-display" id="food-display">
        <h2>Menu</h2>
        <div className="food-display-list">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Choose Your Bottle</h2>
      <div className="food-display-list">
        {products.map((product) => {
          if (category == "All" || product.category == category) {
            return (
              <FoodItem
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={imageUrls[product.id]}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
