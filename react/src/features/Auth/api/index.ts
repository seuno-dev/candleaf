import { login, logout } from "../../../api";
import { REFRESH_KEY } from "../../../api/axios";

export { login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};