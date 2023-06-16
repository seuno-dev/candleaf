import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../features/Auth/hooks/useLogout";
import { getAuthenticationStatus } from "../../api";
import {
  Box,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

// Images
import Logo from "../../assets/images/logo.svg";
import Profile from "../../assets/images/profile.svg";
import Cart from "../../assets/images/cart.svg";

// noinspection JSUnusedGlobalSymbols
function Navbar() {
  const { onLogout } = useLogout();
  const isAuthenticated = getAuthenticationStatus();
  const navigate = useNavigate();

  const handleProfile = () => {
    return navigate("/profile");
  };

  const handleLogout = () => {
    onLogout();
    return navigate("/auth/login");
  };

  const handleOrders = () => {
    return navigate("/orders");
  };

  return (
    <Box as="header" position="fixed" w="full" h="navbarH" bgColor="#FFFFFF" zIndex={200}>
      <Stack
        direction="row"
        w="container.xl"
        mx="auto"
        py={5}
        justify="space-between"
        alignItems="center"
      >
        <Link to="/">
          <Image src={Logo} />
        </Link>
        <Stack direction="row" w={400} justify="space-between">
          <ChakraLink href="#">Discovery</ChakraLink>
          <ChakraLink href="#">About</ChakraLink>
          <ChakraLink href="#">Contact us</ChakraLink>
        </Stack>
        <Stack direction="row" w={20} justify="space-between">
          <Link to="/cart">
            <Image src={Cart} />
          </Link>
          <Menu>
            <MenuButton>
              <Image src={Profile} />
            </MenuButton>
            <MenuList>
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={handleOrders}>Profile</MenuItem>
                  <MenuItem onClick={handleProfile}>Orders</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <MenuItem>Login</MenuItem>
                  </Link>

                  <Link to="/auth/signup">
                    <MenuItem>Sign Up</MenuItem>
                  </Link>
                </>
              )}
            </MenuList>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Navbar;
