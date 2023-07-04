import React, { useEffect } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignUp, { UserCustomer } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  first_name: z.string().nonempty("First name is required."),
  last_name: z.string().nonempty("Last name is required."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, { message: "Password is too short." }),
  phone: z.number({ invalid_type_error: "Phone number must be a number." }),
  address: z.string().nonempty("Address is required."),
});

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutate, isSuccess: created, data, error } = useSignUp();
  const { mutate: login, isSuccess } = useLogin();
  const toast = useToast();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = (data) => mutate(data);
  const e = error as AxiosError<UserCustomer>;

  useEffect(() => {
    if (created) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      login({ email: data.email, password: data.password });
    }
  }, [created]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <Stack
      maxW="full"
      h={{ md: "100vh" }}
      justifyContent="center"
      align="center"
    >
      <Box>
        <Box textAlign="center">
          <Text fontSize="3xl" my="10px">
            Sign Up
          </Text>
          <Text mb="10px">Please fill the required information.</Text>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="5px" w={{ md: "450px" }}>
            <FormControl isInvalid={errors.first_name !== undefined} isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                {...register("first_name")}
                id="first_name"
                type="text"
                placeholder="First Name"
              />
              {errors.first_name && (
                <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.last_name !== undefined} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                {...register("last_name")}
                id="last_name"
                type="text"
                placeholder="Last Name"
              />
              {errors.last_name && (
                <FormErrorMessage>{errors.last_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.phone !== undefined} isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                {...register("phone", {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
                })}
                id="phone"
                type="text"
                placeholder="Phone Number"
              />
              {errors.phone && (
                <FormErrorMessage>{errors.phone.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.address !== undefined} isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                {...register("address")}
                id="address"
                type="text"
                placeholder="Address"
              />
              {errors.address && (
                <FormErrorMessage>{errors.address.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isInvalid={
                errors.email !== undefined ||
                e?.response?.data.email !== undefined
              }
              isRequired
            >
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Email"
              />
              {(errors.email || e?.response?.data.email) && (
                <FormErrorMessage>
                  {errors.email?.message}
                  {e?.response?.data.email}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.password !== undefined} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit" mt="10px" size="md">
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};
export default SignUp;
