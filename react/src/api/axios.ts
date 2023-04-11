import axios from "axios";
import { camelizeKeys } from "humps";

export const REFRESH_KEY = "refresh";
const ACCESS_KEY = "access";

let isRefreshing = false;
type refreshQueueType = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};
const refreshQueue: refreshQueueType[] = [];

export const BASE_URL = "http://127.0.0.1:8000/";

export const instance = axios.create({
  baseURL: BASE_URL,
});

export const login = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}auth/jwt/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.status === 401) {
    throw new Error();
  }
  const data = await response.json();
  const refreshToken = data.refresh;
  const accessToken = data.access;

  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(ACCESS_KEY, accessToken);

  return { refreshToken, accessToken };
};

export const logout = () => {
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
};

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    config.headers["Authorization"] = `JWT ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest &&
      refreshToken
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        console.log("refreshing token!");
        isRefreshing = true;

        const response = await fetch(`${BASE_URL}auth/jwt/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });
        console.log("Refresh status code: ", response.status);
        if (response.status === 200) {
          const data = await response.json();
          const newToken = data.access;
          localStorage.setItem(ACCESS_KEY, newToken);
          refreshQueue.forEach((request) => request.resolve());
          console.log("token refreshed!");
          isRefreshing = false;
          return instance(originalRequest);
        } else if (response.status === 401) {
          logout();
        }
      } else {
        return new Promise<void>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
    }
    return Promise.reject(error);
  }
);
