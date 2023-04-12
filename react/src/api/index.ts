import { client, login, logout, REFRESH_KEY } from "./axios";
import { Category, User } from "../types";

export { client, login, logout };

export const getAuthenticationStatus = () => {
  return localStorage.getItem(REFRESH_KEY) !== null;
};

export const retrieveProfile = async (): Promise<User> => {
  const response = await client.get<User>("/auth/users/me/");
  return response.data;
};

export const retrieveCategoryList = async (): Promise<Category[]> => {
  const response = await client.get<Category[]>("/store/categories/");
  return response.data;
};
