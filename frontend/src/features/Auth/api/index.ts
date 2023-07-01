import { client } from "../../../api";
import { UserCustomer } from "../hooks/useSignUp";

interface OAuthUrl {
  authorizationUrl: string;
}

export const getGoogleAuthLink = async () => {
  const response = await client.get<OAuthUrl>("/auth/o/google-oauth2/", {
    params: {
      redirect_uri: "http://127.0.0.1:3000/auth/o/google-oauth2/callback/",
    },
    withCredentials: true,
  });
  return response.data;
};

export interface OAuthCredential {
  state: string;
  code: string;
}

export const getGoogleAuthToken = async (credential: OAuthCredential) => {
  const response = await client.post("/auth/o/google-oauth2/", credential, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    withCredentials: true,
  });
  return response.data;
};

export const createUserCustomer = async (data: UserCustomer) => {
  const response = await client.post("/store/create-user-customer/", data);
  return response.data;
};