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

export interface Review {
  rating: number;
  comment: string;
}

export interface SimpleReview {
  id: number;
  rating: number;
  comment: string;
}

export type Credential = {
  username: string;
  password: string;
};
