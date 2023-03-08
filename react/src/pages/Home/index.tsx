import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, []);

  return (
    <div className="w-full">
      <Navbar />
      <ProductCard
        title="Best product #1"
        price="$99.99"
        imageUrl="https://cdn.shopify.com/s/files/1/1409/9796/products/PNG_cb4a66d4-5686-498c-806a-2b47ae0fa3b6_1024x1024.png"
      />
    </div>
  );
}

export default Home;
