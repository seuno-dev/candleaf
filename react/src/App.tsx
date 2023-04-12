import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      {/*<Routes>*/}
      {/*  <Route path="/login" element={<Login />} />*/}
      {/*  <Route*/}
      {/*    element={*/}
      {/*      <>*/}
      {/*        <Navbar />*/}
      {/*        <Outlet />*/}
      {/*      </>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Route path="/" element={<Home />}></Route>*/}
      {/*    <Route path="/products" element={<Products />}></Route>*/}
      {/*    <Route*/}
      {/*      path="/products/:slug"*/}
      {/*      element={<ProductDetail addToCart={addToCart} />}*/}
      {/*    ></Route>*/}
      {/*    <Route path="/cart" element={<Cart />}></Route>*/}
      {/*    <Route path="/orders" element={<Order />}></Route>*/}
      {/*    <Route path="/order/payment" element={<StripePayment />}></Route>*/}
      {/*    <Route path="/checkout-success" element={<Success />}></Route>*/}
      {/*    <Route path="/checkout-fail" element={<Fail />}></Route>*/}
      {/*  </Route>*/}
      {/*</Routes>*/}
    </BrowserRouter>
  );
}

export default App;
