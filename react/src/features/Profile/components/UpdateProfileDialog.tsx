import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { Profile, ProfileFieldName } from "../types";
import useUpdateProfile from "../hooks/useUpdateProfile";

interface Props {
  open: boolean;
  handler: () => void;
  title: string;
  fieldName: ProfileFieldName | undefined;
  profile: Profile;
}

const UpdateProfileDialog = ({
  open,
  handler,
  title,
  fieldName,
  profile,
}: Props) => {
  if (!fieldName) return null;

  const { mutate, isLoading, isSuccess } = useUpdateProfile();
  const [value, setValue] = useState(profile[fieldName]);

  useEffect(() => {
    setValue(profile[fieldName]);
  }, [fieldName]);

  useEffect(() => {
    if (isSuccess) handler();
  }, [isSuccess]);

  const onUpdate = () => {
    const newProfile: Profile = { ...profile };
    newProfile[fieldName] = value;
    mutate(newProfile);
  };

  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <Input
          value={value}
          color="light-green"
          className="!border-t-light-green-500 focus:!border-t-light-green-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogBody>
      <DialogFooter>
        <Button color="light-green" onClick={onUpdate} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UpdateProfileDialog;
