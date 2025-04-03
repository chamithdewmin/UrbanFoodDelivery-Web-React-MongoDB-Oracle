import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";


const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { token, setToken, cartDetails, setCartDetails, setUserId } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("userId", "");
    setToken("");
    setUserId("");
    setCartDetails({
      itemCount: 0,
      totalAmount: 0.0,
    });
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/search"
          onClick={() => setMenu("explore")}
          className={menu === "explore" ? "active" : ""}
        >
          Explore
        </Link>
        <a
          href="/#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="/#user-review"
          onClick={() => setMenu("Feedback")}
          className={menu === "user-review" ? "active" : ""}
        >
          Feedback
        </a>
        <a
          href="/#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {/* <Link to="/search">
          <img src={assets.search_icon} alt="" />
        </Link> */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={cartDetails.totalAmount === 0.0 ? "hidden" : "dot"}>
            <p>{cartDetails.itemCount}</p>
          </div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={() => handleLogout()}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
