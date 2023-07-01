import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import useGoogleAuthToken from "../hooks/useGoogleAuthToken";
import { getAuthenticationStatus } from "../../../api";

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { mutate, isSuccess, isError } = useGoogleAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      mutate({ code, state });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) {
      console.log("GAuth success");
      navigate("/");
    }
  }, [isSuccess]);

  return (
    <>
      {isSuccess || (getAuthenticationStatus() && <Navigate to="/" />)}
      {isError && <Navigate to="/auth/login/" />}
    </>
  );
};

export default GoogleOAuthCallback;
