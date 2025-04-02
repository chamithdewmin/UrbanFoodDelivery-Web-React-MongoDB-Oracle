import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationAlert from "../../components/AlertDialog/ConfirmationAlert";

const Cart = () => {
  const {
    url,
    userId,
    token,
    cartDetails,
    setCartDetails,
    getCartDetails,
    setOrderDetails,
    orderDetails,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cartProducts = response.data.cartProducts;
      const updatedCartItems = await Promise.all(
        cartProducts.map(async (product) => {
          const productResponse = await axios.get(
            `${url}/bottle/product/${product.productId}`
          );
          const productImageResponse = await axios.get(
            `${url}/bottle/product/${product.productId}/image`,
            { responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(productImageResponse.data);
          return {
            productId: product.productId,
            image: imageUrl,
            title: productResponse.data.name,
            price: product.productPrice,
            quantity: product.quantity,
            total: product.productPrice * product.quantity,
          };
        })
      );
      setOrderDetails(updatedCartItems);
    } catch (error) {
      console.log("Error getting cart items:", error.response?.data || error);
    }
  };

  const incrementCart = (productId) => {
    const updatedItem = orderDetails.find(
      (item) => item.productId === productId
    );
    const newQuantity = updatedItem.quantity + 1;
    setOrderDetails((prevOrderDetails) =>
      prevOrderDetails.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
    );
  };

  const decrementCart = (productId) => {
    const updatedItem = orderDetails.find(
      (item) => item.productId === productId
    );
    const newQuantity = updatedItem.quantity - 1;
    if (newQuantity < 1) return;
    setOrderDetails((prevOrderDetails) =>
      prevOrderDetails.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
    );
  };

  const getTotalAmount = () => {
    return orderDetails.reduce((total, item) => total + item.total, 0);
  };

  const removeItemFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `${url}/cart/${userId}/items/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOrderDetails((prevOrderDetails) =>
          prevOrderDetails.filter((item) => item.productId !== productId)
        );
        getCartDetails();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  const handleRemoveClick = (item) => {
    setSelectedItem(item); // Set the item to be removed
    setShowAlert(true); // Open the confirmation alert
  };

  const handleConfirmRemove = (confirmed) => {
    setShowAlert(false);
    if (confirmed && selectedItem) {
      removeItemFromCart(selectedItem.productId); // Call remove function if confirmed
    }
  };
  useEffect(() => {
    fetchOrderDetails();
  }, [token]);

  useEffect(() => {
    setCartDetails((prev) => {
      return { ...prev, totalAmount: getTotalAmount() };
    });
  }, [orderDetails]);

  const handleCheckout = () => {
    if (orderDetails.length === 0) {
      alert("Please add items to cart to proceed");
      return;
    }
    navigate("/order");
  };

  return (
    <div className="cart">
      <ConfirmationAlert open={showAlert} onClose={handleConfirmRemove} />
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {orderDetails.map((item, index) => {
          return (
            <>
              <div key={index} className="cart-items-title cart-items-item">
                <img src={item.image} alt="" />
                <p>{item.title}</p>
                <p>${item.price}</p>
                <div className="cart-items-quantity">
                  <img
                    src={assets.remove_icon_red}
                    alt=""
                    onClick={() => decrementCart(item.productId)}
                  />
                  <p>{item.quantity}</p>
                  <img
                    src={assets.add_icon_green}
                    alt=""
                    onClick={() => incrementCart(item.productId)}
                  />
                </div>
                <p>${item.price * item.quantity}</p>
                <p className="cross" onClick={() => handleRemoveClick(item)}>
                  X
                </p>
              </div>
              <hr />
            </>
          );
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${cartDetails.totalAmount}.00</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>FREE</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${cartDetails.totalAmount}
                .00
              </b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promo-code">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promo-code-input">
              <input type="text" placeholder="Enter Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
