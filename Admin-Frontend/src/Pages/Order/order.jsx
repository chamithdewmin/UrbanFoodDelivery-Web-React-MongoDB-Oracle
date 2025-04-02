import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./order.css";
import { AdminContext } from "../../context/AdminContext";
import Button from "@mui/material/Button";

const Order = () => {
  const { url, token } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Track API call status

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/orders/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [url, token]);

  function countItems(orderDetails) {
    return orderDetails.split(",").length;
  }

  const handleStatusChange = async (orderId, newStatus, previousStatus) => {
    setIsUpdating(true);
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await axios.patch(
        `${url}/orders/${orderId}/set?status=${newStatus}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: previousStatus } : order
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
    fetchOrders().then(() => setLoading(false));
  }

  return (
    <div className="order">
      {isUpdating && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="order-header-container">
        <Button
          onClick={handleClick}
          loading={loading}
          loadingIndicator="Loading…"
          variant="outlined"
        >
          Fetch data
        </Button>
      </div>
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders"> No orders available</div>
        ) : null}
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <div className="order-image">
                <img src="src/assets/parcel_icon.png" alt="Package" />
              </div>
              <div className="order-details">
                <p className="order-items">{order.orderDetails}</p>
                <p className="order-info">
                  {order.address.split(",").slice(0, 1).join(",").trim()}
                </p>
                <p className="order-info">
                  {order.address.split(",").slice(1, 3).join(",").trim()}
                </p>
                <p className="order-info">
                  {order.address.split(",").slice(3, 4).join(",").trim()}
                </p>
              </div>
              <div className="order-summary">
                <p>Items: {countItems(order.orderDetails)}</p>
                <p className="order-price">${order.totalAmount}</p>
              </div>
              <div className="order-status">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value, order.status)
                  }
                  className="status-dropdown"
                  disabled={isUpdating}
                >
                  <option value="DELIVERED">Delivered</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
