import React, { useState } from "react";
import useProfile from "../hooks/useProfile";
import { Typography } from "@material-tailwind/react";
import ProfileItemValue from "../components/ProfileItemValue";
import UpdateProfileDialog from "../components/UpdateProfileDialog";

const Profile = () => {
  const { data: profile, error } = useProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [valueDialog, setValueDialog] = useState("");
  const handleOpen = () => setOpenDialog(!openDialog);

  if (error) throw error;

  if (!profile) return null;

  const handleUpdateClick = (title: string, value: string) => {
    setOpenDialog(true);
    setTitleDialog(title);
    setValueDialog(value);
  };

  return (
    <>
      <div className="mt-5 mx-auto w-[450px] grid grid-cols-2 gap-4">
        <Typography>First name</Typography>
        <ProfileItemValue
          value={profile.firstName}
          onUpdateClick={() =>
            handleUpdateClick("First name", profile.firstName)
          }
        />
        <Typography>Last name</Typography>
        <ProfileItemValue
          value={profile.lastName}
          onUpdateClick={() => handleUpdateClick("Last name", profile.lastName)}
        />
        <Typography>Email</Typography>
        <ProfileItemValue
          value={profile.email}
          onUpdateClick={() => handleUpdateClick("Email", profile.email)}
        />
        <Typography>Phone number</Typography>
        <ProfileItemValue
          value={profile.phone}
          onUpdateClick={() => handleUpdateClick("Phone number", profile.phone)}
        />
        <Typography>Address</Typography>
        <ProfileItemValue
          value={profile.address}
          onUpdateClick={() => handleUpdateClick("Address", profile.address)}
        />
      </div>
      <UpdateProfileDialog
        open={openDialog}
        handler={handleOpen}
        title={titleDialog}
        initialValue={valueDialog}
      />
    </>
  );
};

export default Profile;
