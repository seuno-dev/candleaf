import { login } from "./api";
import { useState } from "react";

const REFRESH_KEY = "refresh";
const ACCESS_KEY = "access";

type JWToken = string;

const useAuth = () => {
  const [refreshToken, setRefreshToken] = useState<JWToken | null>(() =>
    localStorage.getItem(REFRESH_KEY)
  );
  const [accessToken, setAccessToken] = useState<JWToken | null>(() =>
    localStorage.getItem(ACCESS_KEY)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(REFRESH_KEY) !== null
  );

  const setTokenPair = (refreshToken: JWToken, accessToken: JWToken) => {
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(ACCESS_KEY, accessToken);

    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
  };

  const onLogin = async (username: string, password: string) => {
    try {
      const { refreshToken, accessToken } = await login(username, password);
      setTokenPair(refreshToken, accessToken);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onLogout = () => {
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ACCESS_KEY);

    setRefreshToken(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return { onLogin, onLogout, isAuthenticated };
};

export default useAuth;
