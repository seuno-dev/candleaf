import React, {useEffect} from "react";
import {Button, Input, Typography} from "@material-tailwind/react";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useSignUp from "../hooks/useSignUp";
import {useNavigate} from "react-router-dom";
import useLogin from "../hooks/useLogin";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  first_name: z.string().nonempty("First name is required."),
  last_name: z.string().nonempty("Last name is required."),
  password: z.string().nonempty("Password is required."),
  phone: z.number({invalid_type_error: "Phone number must be a number."}),
  address: z.string().nonempty("Address is required.")
});

type FormData = z.infer<typeof schema>

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const {mutate, isSuccess:created, data} = useSignUp();
  const {mutate:login, isSuccess} = useLogin();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = data => mutate(data);

  useEffect(() => {
    if (created) {
      login({email: data.email, password: data.password});

    }
  }, [created]);


  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[500px] h-[500px] flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col items-center justify-center">
            <Typography variant="h4">Sign Up</Typography>
            <Typography variant="paragraph">
              Please fill the required information.
            </Typography>
          </div>
          <div className="w-72 h-full flex flex-col items-center justify-center">
            <div className="w-full">
              <Input
                {...register("email")}
                id="email"
                type="text"
                label="Email"
                color={errors.email? "red": undefined}
              />
            </div>
            {errors.email && <p className="w-full text-sm text-red-600 items-start">
              {errors.email.message}
            </p>}
            <div className="mt-4 w-full">
              <Input
                {...register("first_name")}
                id="first_name"
                type="text"
                label="First Name"
                color={errors.first_name? "red": undefined}
              />
            </div>
            {errors.first_name && <p className="w-full text-sm text-red-600 items-start">
              {errors.first_name.message}
            </p>}
            <div className="mt-4 w-full">
              <Input
                {...register("last_name")}
                id="last_name"
                type="text"
                label="Last Name"
                color={errors.last_name? "red": undefined}
              />
            </div>
            {errors.last_name && <p className="w-full text-sm text-red-600 items-start">
              {errors.last_name.message}
            </p>}
            <div className="mt-4 w-full">
              <Input
                {...register("password")}
                id="password"
                type="password"
                label="Password"
                color={errors.password? "red": undefined}
              />
            </div>
            {errors.password && <p className="w-full text-sm text-red-600 items-start">
              {errors.password.message}
            </p>}
            <div className="mt-4 w-full">
              <Input
                {...register("phone", {valueAsNumber: true})}
                id="phone"
                type="text"
                label="Phone Number"
                color={errors.phone? "red": undefined}
              />
            </div>
            {errors.phone && <p className="w-full text-sm text-red-600 items-start">
              {errors.phone.message}
            </p>}
            <div className="mt-4 w-full">
              <Input
                {...register("address")}
                id="address"
                type="text"
                label="Address"
                color={errors.address? "red": undefined}
              />
            </div>
            {errors.address && <p className="w-full text-sm text-red-600 items-start">
              {errors.address.message}
            </p>}
            {created && <div className="mt-4 h-10 w-full bg-green-50 rounded-lg flex items-center justify-center">
              <Typography variant="paragraph" className="text-green-900">
                Account created.
              </Typography>
            </div>}
            <Button className="mt-4 w-full" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
