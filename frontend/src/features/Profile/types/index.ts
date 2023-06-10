export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export type ProfileFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address";
