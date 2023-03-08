import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import useAuth from "../useAuth";
import { useNavigate } from "react-router-dom";
import { User, retrieveProfile } from "../services/api";

function Home() {
  const { onLogout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    return navigate("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, []);

  useEffect(() => {
    retrieveProfile().then((profile) => {
      setProfile(profile);
    });
  }, []);

  return (
    <div>
      <h1>
        Hello {profile.first_name} {profile.last_name}!
      </h1>
      <Button className="bg-red-800" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Home;
