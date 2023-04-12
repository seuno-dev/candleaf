import { Route, Routes } from "react-router-dom";
import React from "react";
import Cart from "./Cart";

const CartRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Cart />} />
    </Routes>
  );
};

export default CartRoutes;
