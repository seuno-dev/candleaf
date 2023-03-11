import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import useCart from "./hooks/useCart";

function App() {
  const { addToCart } = useCart();
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/products", element: <Products /> },
    {
      path: "/products/:slug",
      element: <ProductDetail addToCart={addToCart} />,
    },
    { path: "/cart", element: <Cart /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
