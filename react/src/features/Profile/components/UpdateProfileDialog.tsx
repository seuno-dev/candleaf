import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";

interface Props {
  open: boolean;
  handler: () => void;
  title: string;
  initialValue: string;
}

const UpdateProfileDialog = ({ open, handler, title, initialValue }: Props) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <Input
          value={initialValue}
          color="light-green"
          className="!border-t-light-green-500 focus:!border-t-light-green-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </DialogBody>
      <DialogFooter>
        <Button color="light-green">Update</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UpdateProfileDialog;
