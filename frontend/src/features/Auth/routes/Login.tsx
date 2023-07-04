import React, { useEffect, useState } from "react";
import useLogin from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import useGoogleAuthLink from "../hooks/useGoogleAuthLink";
import {Alert, AlertIcon, Box, Button, FormControl, FormLabel, HStack, Input, Stack, Text} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";


function Login() {
  const { mutate, isSuccess, error } = useLogin();
  const { data: googleAuth, refetch: googleAuthRefetch } = useGoogleAuthLink();
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
    mutate({ email, password });
  };

  const handleGoogleLogin = () => {
    googleAuthRefetch();
  };

  return (
    <Stack mx="15px" h={{md:"100vh"}} justifyContent="center" align="center">
      <Box textAlign="center" my="15px">
        <Text fontSize="3xl" mb="10px">Welcome back!</Text>
        <Text>
          Please enter your credentials to access your account.
        </Text>
      </Box>
      <Stack spacing="10px">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            placeholder="Email"
            data-testid="username-input"
            onChange={handleEmail}
            value={email}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            data-testid="password-input"
            onChange={handlePassword}
            value={password}
          />
        </FormControl>
        {errorMessage && (
          <Alert status="error" mt="5px">
            <AlertIcon/>
            {errorMessage}
          </Alert>
        )}
        <HStack my="10px" mx="auto">
          <Text>
            Don&apos;t have an account?
          </Text>
          <Link
            to="/auth/signup"
          >
            <Button variant="link" colorScheme="green">Sign Up</Button>
          </Link>
        </HStack>
        <Button onClick={handleLogin}>
          Login
        </Button>
        <Button
          mt="5px"
          leftIcon={<FcGoogle />}
          variant="outline"
          _hover={{bg:"blue.50"}}
          color="grey"
          boxShadow="base"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </Stack>
    </Stack>
  );
}

export default Login;
