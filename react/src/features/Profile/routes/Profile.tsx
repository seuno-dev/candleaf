import React from "react";
import useProfile from "../hooks/useProfile";
import { Typography } from "@material-tailwind/react";
import ProfileItemValue from "../components/ProfileItemValue";

const Profile = () => {
  const { data: profile, error } = useProfile();

  if (error) throw error;

  if (!profile) return null;

  return (
    <div className="mt-5 mx-auto w-[450px] grid grid-cols-2 gap-4">
      <Typography>First name</Typography>
      <ProfileItemValue value={profile.firstName} />
      <Typography>Last name</Typography>
      <ProfileItemValue value={profile.lastName} />
      <Typography>Email</Typography>
      <ProfileItemValue value={profile.email} />
      <Typography>Phone number</Typography>
      <ProfileItemValue value={profile.phone} />
      <Typography>Address</Typography>
      <ProfileItemValue value={profile.address} />
    </div>
  );
};

export default Profile;
