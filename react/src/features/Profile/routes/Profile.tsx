import React from "react";
import useProfile from "../hooks/useProfile";
import { Typography } from "@material-tailwind/react";

const Profile = () => {
  const { data: profile, error } = useProfile();

  if (error) throw error;

  if (!profile) return null;

  return (
    <div className="mt-5 mx-auto w-[500px] grid grid-cols-2 gap-4">
      <Typography>First name</Typography>
      <Typography>{profile.firstName}</Typography>
      <Typography>Last name</Typography>
      <Typography>{profile.lastName}</Typography>
      <Typography>Email</Typography>
      <Typography>{profile.email}</Typography>
      <Typography>Phone number</Typography>
      <Typography>{profile.phone}</Typography>
      <Typography>Address</Typography>
      <Typography>{profile.address}</Typography>
    </div>
  );
};

export default Profile;
