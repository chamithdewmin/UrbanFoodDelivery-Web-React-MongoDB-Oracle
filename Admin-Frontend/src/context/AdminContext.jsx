import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "http://localhost:3000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      if (!token) return;
      await axios.get(`${url}/admin/validate?token=${token}`);
      setToken(token);
      navigate("/dashboard");
      setIsLoggedIn(true);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error validating token:", error.response?.data || error);
      localStorage.removeItem("token");
      setToken("");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const contextValue = {
    token,
    setToken,
    url,
    isLoggedIn,
    setIsLoggedIn,
  };
  return (
    <AdminContext.Provider value={contextValue}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
