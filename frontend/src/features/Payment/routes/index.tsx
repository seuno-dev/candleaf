import React from "react";
import { Route, Routes } from "react-router-dom";
import Payment from "./StripePayment";
import Success from "./Success";
import Fail from "./Fail";

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Payment />}></Route>
      <Route path="success" element={<Success />}></Route>
      <Route path="fail" element={<Fail />}></Route>
    </Routes>
  );
};

export default PaymentRoutes;
