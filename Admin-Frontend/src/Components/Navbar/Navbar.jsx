import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Dummy user data - replace with actual data from your auth system
  const userData = {
    name: "Admin User",
    email: "admin@example.com"
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="logo" />
      <div className="profile-container">
        <img 
          className="profile" 
          src={assets.profile_image} 
          alt="profile" 
          onClick={handleProfileClick}
        />
        
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="user-info">
              <p className="user-name">{userData.name}</p>
              <p className="user-email">{userData.email}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;