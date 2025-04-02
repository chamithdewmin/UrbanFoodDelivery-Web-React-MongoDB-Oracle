import { useContext, useState } from "react";
import "./SignUp_LogIn_Form.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setIsLoggedIn, setToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (formData.username === "admin" && formData.password === "123") {
      setError("");
      setToken("hardcoded-token");
      localStorage.setItem("token", "hardcoded-token");
      setIsLoggedIn(true);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.email && formData.password) {
      setError("");
      setIsActive(false);
    } else {
      setError("Please fill all fields");
    }
  };

  return (
    <div className="auth-container">
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="btn">Login</button>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="btn">Register</button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={() => setIsActive(true)}>Register</button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
