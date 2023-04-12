import React from "react";
import { Route, Routes } from "react-router-dom";
import StripePayment from "./StripePayment";
import Success from "./Success";
import Fail from "./Fail";

const StripePaymentRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<StripePayment />}></Route>
      <Route path="success" element={<Success />}></Route>
      <Route path="fail" element={<Fail />}></Route>
    </Routes>
  );
};

export default StripePaymentRoutes;
