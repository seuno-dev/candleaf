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
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import ShoppingCart from "../../assets/images/shopping-cart.svg";
import SearchBar from "./SearchBar";
import { useCategoryList } from "../../hooks/useCategoryList";

// noinspection JSUnusedGlobalSymbols
function Navbar() {
  const { isAuthenticated, onLogout } = useAuth();
  const { user } = useProfile();
  const { categories } = useCategoryList();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  // noinspection JSUnusedGlobalSymbols
  const profileTriggers = {
    onMouseEnter: () => setOpenProfileMenu(true),
    onMouseLeave: () => setOpenProfileMenu(false),
  };
  // noinspection JSUnusedGlobalSymbols
  const categoryTriggers = {
    onMouseEnter: () => setOpenCategoryMenu(true),
    onMouseLeave: () => setOpenCategoryMenu(false),
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    return navigate("/auth/login");
  };

  const handleOrders = () => {
    return navigate("/orders");
  };

  const handleCategoryClick = (categoryId: string) => {
    return navigate({
      pathname: "products",
      search: createSearchParams({
        category: categoryId,
        page: "1",
      }).toString(),
    });
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
        <div className="px-5">
          <Menu open={openCategoryMenu} handler={setOpenCategoryMenu}>
            <MenuHandler {...categoryTriggers}>
              <Typography
                className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
                variant="small"
              >
                Category
              </Typography>
            </MenuHandler>
            <MenuList {...categoryTriggers}>
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id.toString())}
                >
                  <Typography>{category.title}</Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
        <div className="w-full">
          <SearchBar onSearchSubmit={onProductSearch} />
        </div>
        <div className="ml-8 flex flex-row items-center">
          <Link className="w-12" to="/cart">
            <img src={ShoppingCart} alt="Icon of shopping cart" />
          </Link>
          {isAuthenticated && (
            <Menu open={openProfileMenu} handler={setOpenProfileMenu}>
              <MenuHandler {...profileTriggers}>
                <Typography
                  className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
                  variant="small"
                >
                  {user.firstName} {user.lastName}
                </Typography>
              </MenuHandler>
              <MenuList {...profileTriggers}>
                <MenuItem onClick={handleOrders}>
                  <Typography>Orders</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          {!isAuthenticated && (
            <Menu>
              <MenuHandler {...profileTriggers}>
                <Typography
                  className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
                  variant="small"
                >
                  <Link to="/auth/login">
                    Login
                  </Link>
                </Typography>
              </MenuHandler>
            </Menu>
          )}
        </div>
      </div>
    </BaseNavbar>
  );
}

export default Navbar;
