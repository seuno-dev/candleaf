import { client, login, logout } from "./axios";
import { Category, User } from "../types";

export { client, login, logout };

export const retrieveProfile = async (): Promise<User> => {
  const response = await client.get<User>("/auth/users/me/");
  return response.data;
};

export const retrieveCategoryList = async (): Promise<Category[]> => {
  const response = await client.get<Category[]>("/store/categories/");
  return response.data;
};
