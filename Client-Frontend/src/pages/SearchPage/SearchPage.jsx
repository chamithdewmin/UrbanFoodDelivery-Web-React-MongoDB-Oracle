import React, { useContext, useState } from "react";
import "./SearchPage.css";
import Lottie from "lottie-react";
import animationData from "../../assets/search.json";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductImageUrl, setSelectedProductImageUrl] = useState("");

  const { url } = useContext(StoreContext);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value) {
      const response = await axios.get(
        `${url}/food/products/search?keyword=${value}`
      );
      setFilteredProducts(response.data);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = async (product) => {
    setSelectedProduct(product);
    setSearchInput("");
    setFilteredProducts([]);
    axios
      .get(`${url}/food/product/${product.id}/image`, {
        responseType: "blob",
      })
      .then((response) => {
        const imageUrl = URL.createObjectURL(response.data);
        setSelectedProductImageUrl(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching product image:", error);
      });
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredProducts([]);
  };

  return (
    <div className="search-page">
      <div className="search-bar-container">
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Products"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {searchInput && (
            <button className="clear-button" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
        <div className="search-results">
          {searchInput && filteredProducts.length === 0 && (
            <div className="no-results">No products found</div>
          )}
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleProductClick(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      </div>
      <div className="search-page-content">
        {selectedProduct ? (
          <FoodItem
            key={selectedProduct.id}
            id={selectedProduct.id}
            name={selectedProduct.name}
            description={selectedProduct.description}
            price={selectedProduct.price}
            image={selectedProductImageUrl}
          />
        ) : (
          <div className="initial-content ">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ height: 250, width: 250 }}
            />
            <p className="typing-animation">Search what you want....</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
