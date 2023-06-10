import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderList from "./OrderList";

const OrderRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<OrderList />} />
    </Routes>
  );
};

export default OrderRoutes;
