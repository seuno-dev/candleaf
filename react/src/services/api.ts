import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const REFRESH_KEY = "refresh";
const ACCESS_KEY = "access";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    config.headers["Authorization"] = `JWT ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return new Promise((resolve) => {
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

        const response = fetch(`${BASE_URL}auth/jwt/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            localStorage.setItem(ACCESS_KEY, res.access);

            return axios(originalRequest);
          });
        resolve(response);
      }
      return Promise.reject(error);
    });
  }
);

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

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};
export const retrieveProfile = async () => {
  const response = await instance.get<User>("/auth/users/me/");
  return response.data;
};
