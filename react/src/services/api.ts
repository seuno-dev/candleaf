import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const REFRESH_KEY = "refresh";
const ACCESS_KEY = "access";

let isRefreshing = false;
type refreshQueueType = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};
const refreshQueue: refreshQueueType[] = [];

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
        const data = await response.json();
        const newToken = data.access;
        localStorage.setItem(ACCESS_KEY, newToken);
        refreshQueue.forEach((request) => request.resolve());
        console.log("token refreshed!");
        return instance(originalRequest);
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

export type ProductImageResponse = {
  id: number;
  image: string;
};
export type ProductResponse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  unit_price: number;
  inventory: number;
  collection: number;
  images: ProductImageResponse[];
};
export type ProductListResponse = ProductResponse[];
export const retrieveProductsList = async () => {
  const response = await instance.get<ProductListResponse>("/store/products/");
  return response.data;
};

export const retrieveProductDetail = async (slug: string) => {
  const response = await instance.get<ProductResponse>(
    `/store/products/${slug}/`
  );
  return response.data;
};

export const createCartItem = async (productId: number) => {
  try {
    const response = await instance.post("/store/cart-items/", {
      product_id: productId,
      quantity: 1,
    });
    return response.status === 201;
  } catch (e) {
    return false;
  }
};
