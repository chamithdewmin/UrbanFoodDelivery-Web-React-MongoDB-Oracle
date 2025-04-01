import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { cartDetails, url, userId, token, orderDetails } =
    useContext(StoreContext);

  // State to track form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function for clearing input fields
  const clearData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
    });
  };

  const orderSummary = () => {
    return orderDetails
      .map((item) => `${item.title} x ${item.quantity}`)
      .join(", ");
  };
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const cartDetailsResponse = await axios.get(`${url}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartId = cartDetailsResponse.data.id;
      const orderData = {
        userId: userId,
        cartId: cartId,
        totalAmount: cartDetails.totalAmount,
        orderDetails: orderSummary(),
        status: "PENDING",
        address: `${formData.firstName} ${formData.lastName}, ${formData.street} ${formData.city} ${formData.state}, ${formData.zipCode} ${formData.country}, ${formData.phone}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("orderData", JSON.stringify(orderData));
      const paymentResponse = await axios.post(
        `${url}/payments/checkout`,
        {
          totalAmount: cartDetails.totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (paymentResponse.status === 200) {
        // Redirect user to Stripe's checkout session
        window.location.href = paymentResponse.data.sessionUrl;
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <form className="place-order" onSubmit={handlePlaceOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Zip code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="place-order-right">
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
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
