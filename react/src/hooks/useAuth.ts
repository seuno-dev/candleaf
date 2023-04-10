import { getAuthenticationStatus, login, logout } from "../api/api";
import { useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    getAuthenticationStatus
  );

  const onLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return { onLogin, onLogout, isAuthenticated };
};

export default useAuth;