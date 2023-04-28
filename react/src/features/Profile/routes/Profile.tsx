import React, { useState } from "react";
import useRetrieveProfile from "../hooks/useRetrieveProfile";
import { Typography } from "@material-tailwind/react";
import ProfileItemValue from "../components/ProfileItemValue";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import { ProfileFieldName } from "../types";

const Profile = () => {
  const { data: profile, error } = useRetrieveProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [fieldNameDialog, setFieldNameDialog] = useState<ProfileFieldName>();
  const handleOpen = (open: boolean | undefined) => {
    if (open == undefined) setOpenDialog(!openDialog);
    else setOpenDialog(open);
  };

  if (error) throw error;

  if (!profile) return null;

  const handleUpdateClick = (title: string, name: ProfileFieldName) => {
    setOpenDialog(true);
    setTitleDialog(title);
    setFieldNameDialog(name);
  };

  return (
    <>
      <div className="mt-5 mx-auto w-[450px] grid grid-cols-2 gap-4">
        <Typography>First name</Typography>
        <ProfileItemValue
          value={profile.firstName}
          onUpdateClick={() => handleUpdateClick("First name", "firstName")}
        />
        <Typography>Last name</Typography>
        <ProfileItemValue
          value={profile.lastName}
          onUpdateClick={() => handleUpdateClick("Last name", "lastName")}
        />
        <Typography>Email</Typography>
        <ProfileItemValue
          value={profile.email}
          onUpdateClick={() => handleUpdateClick("Email", "email")}
        />
        <Typography>Phone number</Typography>
        <ProfileItemValue
          value={profile.phone}
          onUpdateClick={() => handleUpdateClick("Phone number", "phone")}
        />
        <Typography>Address</Typography>
        <ProfileItemValue
          value={profile.address}
          onUpdateClick={() => handleUpdateClick("Address", "address")}
        />
      </div>
      <UpdateProfileDialog
        open={openDialog}
        handler={handleOpen}
        title={titleDialog}
        fieldName={fieldNameDialog}
        profile={profile}
      />
    </>
  );
};

export default Profile;
