import React, { useContext, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import MyOrders from "./pages/MyOrders/MyOrders";
import SearchPage from "./pages/SearchPage/SearchPage";
import SimpleAlert from "./components/SimpleAlert/SimpleAlert";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [alertColor, setAlertColor] = useState("#64bf47");
  const [alertText, setAlertText] = useState("");

  if (showLogin) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <>
      {visible ? (
        <SimpleAlert
          color={alertColor}
          setVisible={setVisible}
          visible={visible}
          text={alertText}
        />
      ) : null}
      {showLogin ? (
        <LoginPopup
          setShowLogin={setShowLogin}
          setAlertColor={setAlertColor}
          setVisible={setVisible}
          setAlertText={setAlertText}
        />
      ) : (
        <></>
      )}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/success" element={<PaymentSuccess />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
