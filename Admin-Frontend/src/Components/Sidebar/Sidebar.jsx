import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
            <NavLink to='/dashboard' className="sidebar-option">
                <img src={assets.order_icon} alt="add icon" />
                <p>Dashboard</p>
            </NavLink>
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="add icon" />
                <p>Add Item</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.order_icon} alt="add icon" />
                <p>List Item</p>
            </NavLink>
            <NavLink to='/order' className="sidebar-option">
                <img src={assets.order_icon} alt="add icon" />
                <p>Orders</p>
            </NavLink>
            <NavLink to='/promocode' className="sidebar-option">
                <img src={assets.order_icon} alt="add icon" />
                <p>Promo Code</p>
            </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;