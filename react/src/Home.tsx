import React, { useEffect } from "react";
import { Button } from "@material-tailwind/react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

function Home() {
  const { onLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    return navigate("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Hello world!</h1>
      <Button className="bg-red-800" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Home;
