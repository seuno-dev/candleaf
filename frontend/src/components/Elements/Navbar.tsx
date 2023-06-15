import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../features/Auth/hooks/useLogout";
import { getAuthenticationStatus } from "../../api";
import useRetrieveProfile from "../../features/Profile/hooks/useRetrieveProfile";
import useCategories from "../../features/Products/hooks/useCategories";
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
  useDisclosure,
} from "@chakra-ui/react";

// Images
import Logo from "../../assets/images/logo.svg";
import Profile from "../../assets/images/profile.svg";
import Cart from "../../assets/images/cart.svg";

// noinspection JSUnusedGlobalSymbols
function Navbar() {
  const { onLogout } = useLogout();
  const isAuthenticated = getAuthenticationStatus();

  const { data } = useRetrieveProfile();
  const { data: categories } = useCategories();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  // noinspection JSUnusedGlobalSymbols
  const categoryTriggers = {
    onMouseEnter: () => setOpenCategoryMenu(true),
    onMouseLeave: () => setOpenCategoryMenu(false),
  };

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
    <Box w="full">
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

  // return (
  //   <BaseNavbar fullWidth={true} color="light-green" variant="filled">
  //     <div className="container mx-auto flex items-center justify-between">
  //       <Link data-testid="navbar-brand" to="/">
  //         <Typography variant="h4">ShopZone</Typography>
  //       </Link>
  //       <div className="px-5">
  //         <Menu open={openCategoryMenu} handler={setOpenCategoryMenu}>
  //           <MenuHandler {...categoryTriggers}>
  //             <Typography
  //               className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
  //               variant="small"
  //               data-testid="navbar-category"
  //             >
  //               Category
  //             </Typography>
  //           </MenuHandler>
  //           <MenuList {...categoryTriggers}>
  //             {categories?.map((category) => (
  //               <MenuItem
  //                 key={category.id}
  //                 onClick={() => handleCategoryClick(category.id.toString())}
  //               >
  //                 <Typography>{category.title}</Typography>
  //               </MenuItem>
  //             ))}
  //           </MenuList>
  //         </Menu>
  //       </div>
  //       <div className="w-full">
  //         <SearchBar onSearchSubmit={onProductSearch} />
  //       </div>
  //       <div className="ml-8 flex flex-row items-center">
  //         <Link className="w-12" to="/cart">
  //           <img src={ShoppingCart} alt="Icon of shopping cart" />
  //         </Link>
  //         {isAuthenticated && data && (
  //           <Menu open={openProfileMenu} handler={setOpenProfileMenu}>
  //             <MenuHandler {...profileTriggers}>
  //               <Typography
  //                 className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
  //                 variant="small"
  //               >
  //                 {data.firstName} {data.lastName}
  //               </Typography>
  //             </MenuHandler>
  //             <MenuList {...profileTriggers}>
  //               <MenuItem onClick={handleProfile}>
  //                 <Typography>Profile</Typography>
  //               </MenuItem>
  //               <MenuItem onClick={handleOrders}>
  //                 <Typography>Orders</Typography>
  //               </MenuItem>
  //               <MenuItem onClick={handleLogout}>
  //                 <Typography>Logout</Typography>
  //               </MenuItem>
  //             </MenuList>
  //           </Menu>
  //         )}
  //         {!isAuthenticated && (
  //           <Menu>
  //             <MenuHandler {...profileTriggers}>
  //               <Typography
  //                 className="w-32 h-10 rounded-md leading-10 hei text-center align-middle cursor-pointer hover:bg-light-green-300"
  //                 variant="small"
  //               >
  //                 <Link to="/auth/login">Login</Link>
  //               </Typography>
  //             </MenuHandler>
  //           </Menu>
  //         )}
  //       </div>
  //     </div>
  //   </BaseNavbar>
  // );
}

export default Navbar;
