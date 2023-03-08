import { useEffect, useState } from "react";
import { User, retrieveProfile } from "../services/api";
import useAuth from "./useAuth";

const useProfile = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    retrieveProfile().then((user) => {
      setUser(user);
    });
  }, [isAuthenticated]);

  return {
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
};

export default useProfile;
