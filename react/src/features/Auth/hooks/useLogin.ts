import { useMutation } from "@tanstack/react-query";
import { ACCESS_KEY, REFRESH_KEY } from "../../../api/client";
import { login } from "../../../api";
import { Credential } from "../../../types";

const useLogin = () =>
  useMutation({
    mutationFn: (credential: Credential) => login(credential),
    onSuccess: (data) => {
      console.log(data);
      const { refresh, access } = data;
      localStorage.setItem(REFRESH_KEY, refresh);
      localStorage.setItem(ACCESS_KEY, access);
      return true;
    },
    onError: () => false,
  });

export default useLogin;
