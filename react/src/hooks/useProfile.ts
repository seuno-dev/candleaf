import { useEffect, useState } from "react";
import { retrieveProfile } from "../api";
import { User } from "../types";

const useProfile = () => {
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
  }, []);

  return { user };
};

export default useProfile;
