import { ACCESS_KEY, BASE_URL, client, logout, REFRESH_KEY } from "./client";
import { Credential } from "../types";

export { client, logout };

export const login = async (credential: Credential) => {
  const response = await fetch(`${BASE_URL}/auth/jwt/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  });
  if (response.status === 200) return await response.json();
  else throw new Error();
};

export const getAuthenticationStatus = () => {
  return (
    localStorage.getItem(REFRESH_KEY) !== null &&
    localStorage.getItem(ACCESS_KEY) !== null
  );
};
