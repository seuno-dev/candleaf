import { useEffect, useState } from "react";
import { retrieveProfile } from "../api/api";
import useAuth from "./useAuth";
import { User } from "../types";

const useProfile = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    retrieveProfile().then((user) => {
      setUser(user);
    });
  }, [isAuthenticated]);

  return { user };
};

export default useProfile;
