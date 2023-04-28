import React from "react";
import { Typography } from "@material-tailwind/react";

interface Props {
  value: string;
}

const ProfileItemValue = ({ value }: Props) => {
  return (
    <div className="flex">
      <Typography>{value}</Typography>
      <Typography href="#" className="text-light-green-500 font-bold ml-2">
        <a href="#">Update</a>
      </Typography>
    </div>
  );
};

export default ProfileItemValue;
