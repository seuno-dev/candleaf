import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const instance = axios.create({
  baseURL: BASE_URL,
});

export const login = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  const refreshToken = data.refresh;
  const accessToken = data.access;
  return { refreshToken, accessToken };
};
