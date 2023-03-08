import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar as BaseNavbar,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";

function Navbar() {
  const { onLogout } = useAuth();
  const { firstName, lastName } = useProfile();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const triggers = {
    onMouseEnter: () => setOpenProfileMenu(true),
    onMouseLeave: () => setOpenProfileMenu(false),
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    return navigate("/login");
  };

  return (
    <BaseNavbar fullWidth={true} color="light-green" variant="filled">
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          className="hover:cursor-pointer"
          variant="h6"
          onClick={() => navigate("/")}
        >
          DjangoKart
        </Typography>
        <Menu open={openProfileMenu} handler={setOpenProfileMenu}>
          <MenuHandler {...triggers}>
            <Button variant="text" color="white">
              <Typography variant="small">
                {firstName} {lastName}
              </Typography>
            </Button>
          </MenuHandler>
          <MenuList {...triggers}>
            <MenuItem onClick={handleLogout}>
              <Typography>Logout</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </BaseNavbar>
  );
}

export default Navbar;
