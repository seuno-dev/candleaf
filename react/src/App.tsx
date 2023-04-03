import React from "react";
import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import useCart from "./hooks/useCart";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Success from "./pages/Checkout/Success";
import Fail from "./pages/Checkout/Fail";

function App() {
  const { addToCart } = useCart();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route
            path="/products/:slug"
            element={<ProductDetail addToCart={addToCart} />}
          ></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout-success" element={<Success />}></Route>
          <Route path="/checkout-fail" element={<Fail />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
