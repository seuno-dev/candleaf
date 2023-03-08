import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, []);

  return (
    <div className="w-full">
      <Navbar />
    </div>
  );
}

export default Home;
