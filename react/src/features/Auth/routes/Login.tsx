import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { onLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (await onLogin(username, password)) {
      navigate("/");
    } else {
      setErrorMessage("Invalid username or password");
    }
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
              label="Username"
              onChange={handleUsername}
              value={username}
            />
          </div>
          <div className="mt-4 w-full">
            <Input
              type="password"
              label="Password"
              onChange={handlePassword}
              value={password}
            />
          </div>
          {errorMessage && (
            <div className="mt-4 h-10 w-full bg-red-50 rounded-lg flex items-center justify-center">
              <Typography variant="paragraph" className="text-red-900">{errorMessage}</Typography>
            </div>
          )}
          <Button className="mt-4 w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
