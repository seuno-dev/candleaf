import { useMutation } from "@tanstack/react-query";
import { getGoogleAuthToken, OAuthCredential } from "../api";
import { ACCESS_KEY, REFRESH_KEY } from "../../../api/client";

const useGoogleAuthToken = () =>
  useMutation({
    mutationKey: ["google_auth_token"],
    mutationFn: (credential: OAuthCredential) => getGoogleAuthToken(credential),
    onSuccess: (data) => {
      const { refresh, access } = data;
      localStorage.setItem(REFRESH_KEY, refresh);
      localStorage.setItem(ACCESS_KEY, access);    },
  });

export default useGoogleAuthToken;
