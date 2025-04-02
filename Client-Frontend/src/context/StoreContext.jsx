import { createContext, useEffect, useState } from "react";
import { drink_list } from "../assets/assets";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import AlertDialogSlide from "../components/AlertDialog/AlertDialog";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartDetails, setCartDetails] = useState({
    itemCount: 0,
    totalAmount: 0.0,
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const url = "http://localhost:8083";

  const [orderDetails, setOrderDetails] = useState([]);

  const addToCart = async (productId, quantity, price) => {
    if (token === "") {
      setShowAlert(true);
      return;
    }
    try {
      const response = await axios.post(
        `${url}/cart/${userId}/items?productId=${productId}&quantity=${quantity}&productPrice=${price}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowSuccessAlert(true);
      setCartDetails((prev) => ({
        ...prev,
        itemCount: response.data.cartProducts.length,
        totalAmount: response.data.totalAmount,
      }));
    } catch (error) {
      if (error.response.status === 401) {
        setShowAlert(true);
        setToken("");
        setUserId("");
      }
      console.error("Error adding to cart:", error.response?.data || error);
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const getCartDetails = async () => {
    try {
      const response = await axios.get(`${url}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartDetails({
        itemCount: response.data.cartProducts.length,
        totalAmount: response.data.totalAmount,
      });
    } catch (error) {
      console.log("Error getting cart items:", error.response?.data || error);
    }
  };

  const validateToken = async () => {
    try {
      if (!token) return;

      const response = await axios.get(`${url}/auth/validate?token=${token}`);

      const { userId: validatedUserId } = response.data;
      setToken(token);
      setUserId(validatedUserId);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", validatedUserId);
    } catch (error) {
      console.error("Error validating token:", error.response?.data || error);

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setToken("");
      setUserId("");
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    if (token && userId) {
      getCartDetails();
    }
  }, [token, userId]);

  const contextValue = {
    drink_list,
    cartDetails,
    setCartDetails,
    addToCart,
    token,
    setToken,
    getCartDetails,
    url,
    userId,
    setUserId,
    setShowAlert,
    orderDetails,
    setOrderDetails,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
      <Snackbar
        open={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        autoHideDuration={2000}
      >
        <Alert sx={{ bgcolor: "#64bf47" }} variant="filled" severity="success">
          Product added successfully.
        </Alert>
      </Snackbar>
      <AlertDialogSlide open={showAlert} onClose={setShowAlert} />
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
