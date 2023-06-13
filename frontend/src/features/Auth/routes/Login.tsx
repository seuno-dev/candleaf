import React, {useEffect, useState} from "react";
import {Button, Input, Typography} from "@material-tailwind/react";
import useLogin from "../hooks/useLogin";
import {Link, useNavigate} from "react-router-dom";
import useGoogleAuthLink from "../hooks/useGoogleAuthLink";
import GoogleIcon from "../../../assets/images/google.svg";

function Login() {
  const {mutate, isSuccess, error} = useLogin();
  const {data: googleAuth, refetch: googleAuthRefetch} = useGoogleAuthLink();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      setErrorMessage("Invalid username or password");
    }
  }, [error]);

  useEffect(() => {
    if (googleAuth) {
      window.location.replace(googleAuth.authorizationUrl);
    }
  }, [googleAuth]);

  const handleLogin = async () => {
    mutate({email, password});
  };

  const handleGoogleLogin = () => {
    googleAuthRefetch();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[500px] h-[300px] flex flex-col items-center">
        <div className="w-full h-[150px] flex flex-col items-center justify-center">
          <Typography variant="h4">Welcome back!</Typography>
          <Typography variant="paragraph">
            Please enter your credentials to access your account.
          </Typography>
        </div>
        <div className="w-72 h-full flex flex-col items-center justify-center">
          <div className="w-full">
            <Input
              type="text"
              label="Email"
              data-testid="username-input"
              onChange={handleEmail}
              value={email}
            />
          </div>
          <div className="mt-4 w-full">
            <Input
              type="password"
              label="Password"
              data-testid="password-input"
              onChange={handlePassword}
              value={password}
            />
          </div>
          {errorMessage && (
            <div className="mt-4 h-10 w-full bg-red-50 rounded-lg flex items-center justify-center">
              <Typography variant="paragraph" className="text-red-900">
                {errorMessage}
              </Typography>
            </div>
          )}
          <div className="mt-4">
            <Typography variant="paragraph">
              Don&apos;t have an account? <Link to="/auth/signup" className="text-blue-600  hover:underline">Sign Up</Link>
            </Typography>
          </div>
          <Button className="mt-4 w-full" onClick={handleLogin}>
            Login
          </Button>
          <Button
            className="mt-4 w-full flex items-center justify-center gap-3"
            variant="outlined"
            color="blue-gray"
            onClick={handleGoogleLogin}
          >
            <img src={GoogleIcon} alt="metamask" className="h-6 w-6"/>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
