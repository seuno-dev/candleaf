import { SimpleProduct } from "../features/Products/types";

export type Category = {
  id: number;
  title: string;
  slug: string;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};



export type CreatePayment = {
  clientSecret: string;
};

