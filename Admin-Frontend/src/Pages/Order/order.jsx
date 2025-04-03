import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./order.css";
import { AdminContext } from "../../context/AdminContext";
import Button from "@mui/material/Button";
import { TreeSelect } from "antd";  // Ensure that antd is installed

const Order = () => {
  const { token } = useContext(AdminContext); // Only fetch token from context
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Track API call status
  const [updatedOrders, setUpdatedOrders] = useState([]); // Store locally updated orders before sending to DB

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data); // Set the orders array (array of arrays)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  function countItems(orderDetails) {
    return orderDetails.split(",").length;
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order[0] === orderId ? { ...order, status: newStatus } : order
      )
    );
    setUpdatedOrders((prevUpdatedOrders) =>
      prevUpdatedOrders.filter((order) => order[0] !== orderId).concat({
        orderId,
        status: newStatus,
      })
    );
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      for (let updatedOrder of updatedOrders) {
        await axios.put(
          `http://localhost:3000/api/orders/${updatedOrder.orderId}`,
          { status: updatedOrder.status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setUpdatedOrders([]); // Reset updated orders after successful update
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setIsUpdating(true);
    try {
      // Send delete request to the server
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted order from the UI
      setOrders((prevOrders) => prevOrders.filter((order) => order[0] !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const [loading, setLoading] = useState(false);
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

        <Button
          onClick={handleUpdateStatus}
          variant="contained"
          color="primary"
          disabled={isUpdating || updatedOrders.length === 0}
        >
          Update
        </Button>
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders"> No orders available</div>
        ) : null}
        {orders.map((order) => {
          const [orderId, userId, orderDate, totalAmount, status] = order; // Destructure the array
          return (
            <div key={orderId} className="order-item">
              <div className="order-header">
                <div className="order-image">
                  <img src="src/assets/parcel_icon.png" alt="Package" />
                </div>
                <div className="order-details">
                  <p className="order-items">{`Order ID: ${orderId}`}</p>
                  <p className="order-info">{`User ID: ${userId}`}</p>
                  <p className="order-info">{`Date: ${new Date(orderDate).toLocaleString()}`}</p>
                </div>
                <div className="order-summary">
                  <p>Items: {countItems(orderId.toString())}</p>
                  <p className="order-price">${totalAmount}</p>
                </div>
                <div className="order-status">
                  <TreeSelect
                    value={status}
                    onChange={(newStatus) => handleStatusChange(orderId, newStatus)}
                    treeData={[
                      { title: "Delivered", value: "DELIVERED" },
                      { title: "Pending", value: "PENDING" },
                      { title: "Cancel", value: "CANCEL" },
                    ]}
                    className="status-dropdown"
                    disabled={isUpdating}
                  />
                </div>
                <div className="order-delete">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteOrder(orderId)}
                    disabled={isUpdating}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
