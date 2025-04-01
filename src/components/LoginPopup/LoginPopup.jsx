import React, { useContext, useEffect, useState } from "react";
import "./SignUp_LogIn_Form.css"; // Make sure to use the new CSS
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const LoginPopup = ({
  setShowLogin,
  setAlertColor,
  setVisible,
  setAlertText,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { url, setToken, setUserId } = useContext(StoreContext);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const clearData = () => {
    setData({
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${url}/auth/login`, {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      setToken(response.data.token);
      setUserId(response.data.userId);
      setShowLogin(false);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await axios.post(`${url}/auth/register`, data);
      setAlertText("Account created successfully");
      setAlertColor("#64bf47");
      setVisible(true);
      clearData();
      setIsActive(false);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <ClearOutlinedIcon
        className="close-button"
        onClick={() => setShowLogin(false)}
      />
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={data.username}
                onChange={onInputChange}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={data.password}
                onChange={onInputChange}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            {/* <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div> */}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                value={data.name}
                onChange={onInputChange}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={data.email}
                onChange={onInputChange}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            {/* <div className="input-box">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                pattern="[0-9]{10}"
                required
                value={data.phone}
                onChange={onInputChange}
              />
              <i className="bx bxs-phone"></i>
            </div> */}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={data.username}
                onChange={onInputChange}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={data.password}
                onChange={onInputChange}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn">
              Register
            </button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>

        <img
          className="close-icon"
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
        />
      </div>
    </div>
  );
};

export default LoginPopup;
