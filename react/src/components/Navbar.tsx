import React, { useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar as BaseNavbar,
  Typography,
} from "@material-tailwind/react";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import ShoppingCart from "../assets/images/shopping-cart.svg";
import SearchBar from "./SearchBar";

// noinspection JSUnusedGlobalSymbols
function Navbar() {
  const { onLogout } = useAuth();
  const { firstName, lastName } = useProfile();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  // noinspection JSUnusedGlobalSymbols
  const triggers = {
    onMouseEnter: () => setOpenProfileMenu(true),
    onMouseLeave: () => setOpenProfileMenu(false),
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    return navigate("/login");
  };

  const handleOrders = () => {
    return navigate("/orders");
  };

  const onProductSearch = (search: string) => {
    return navigate({
      pathname: "products",
      search: createSearchParams({
        search: search,
        page: "1",
      }).toString(),
    });
  };

  return (
    <BaseNavbar fullWidth={true} color="light-green" variant="filled">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <Typography variant="h4">DjangoKart</Typography>
        </Link>
        <div className="w-[800px] mx-3">
          <SearchBar onSearchSubmit={onProductSearch} />
        </div>
        <div className="flex flex-row items-center">
          <Link className="mr-5" to="/cart">
            <img src={ShoppingCart} alt="Icon of shopping cart" />
          </Link>
          <Menu open={openProfileMenu} handler={setOpenProfileMenu}>
            <MenuHandler {...triggers}>
              <Typography
                className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
                variant="small"
              >
                {firstName} {lastName}
              </Typography>
            </MenuHandler>
            <MenuList {...triggers}>
              <MenuItem onClick={handleOrders}>
                <Typography>Orders</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography>Logout</Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </BaseNavbar>
  );
}

export default Navbar;
