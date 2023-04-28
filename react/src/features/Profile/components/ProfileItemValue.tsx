import React from "react";
import { Typography } from "@material-tailwind/react";

interface Props {
  value: string;
  onUpdateClick: () => void;
}

const ProfileItemValue = ({ value, onUpdateClick }: Props) => {
  return (
    <div className="flex">
      <Typography>{value}</Typography>
      <Typography href="#" className="text-light-green-500 font-bold ml-2">
        <a href="#" onClick={onUpdateClick}>
          Update
        </a>
      </Typography>
    </div>
  );
};

export default ProfileItemValue;
