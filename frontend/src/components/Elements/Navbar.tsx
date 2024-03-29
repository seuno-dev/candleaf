import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../features/Auth/hooks/useLogout";
import { getAuthenticationStatus } from "../../api";
import {
  Box,
  Container,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";

// Images
import Logo from "../../assets/images/logo.svg";
import Profile from "../../assets/images/profile.svg";
import Cart from "../../assets/images/cart.svg";
import { HamburgerIcon } from "@chakra-ui/icons";

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
    <Box
      as="header"
      position="fixed"
      w="100%"
      h="navbarH"
      bgColor="#FFFFFF"
      zIndex={200}
    >
      <Container maxW="container.xl">
        <Stack
          direction="row"
          mx="auto"
          h="navbarH"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="/">
            <Image src={Logo} />
          </Link>
          <Stack
            direction="row"
            w={400}
            justifyContent="space-between"
            hideBelow="md"
          >
            <ChakraLink>
              <Link to="/products">All products</Link>
            </ChakraLink>
            <ChakraLink href="#">About</ChakraLink>
            <ChakraLink href="#">Contact us</ChakraLink>
          </Stack>
          <Stack direction="row" justify="space-between" spacing={8}>
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
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleOrders}>Orders</MenuItem>
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
            <Box hideFrom="md">
              <Menu>
                <MenuButton>
                  <HamburgerIcon w={30} h={30} />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <ChakraLink>
                      <Link to="/products">All products</Link>
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem>
                    <ChakraLink href="#">About</ChakraLink>
                  </MenuItem>
                  <MenuItem>
                    <ChakraLink href="#">Contact us</ChakraLink>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Navbar;
