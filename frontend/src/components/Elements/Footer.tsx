import React from "react";
import {
  Box,
  Container,
  Divider,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Logo from "../../assets/images/logo-footer.svg";

interface MenuItem {
  text: string;
  to: string;
}

interface FooterMenuProps {
  title: string;
  menuList: MenuItem[];
}

const FooterMenu = ({ title, menuList }: FooterMenuProps) => (
  <VStack alignItems="start">
    <Text mb="24px" color="primary">
      {title}
    </Text>
    {menuList.map(({ text, to }, index) => (
      <Link key={index} href={to}>
        <Text color="white">{text}</Text>
      </Link>
    ))}
  </VStack>
);
const Footer = () => {
  const menus: FooterMenuProps[] = [
    {
      title: "Discovery",
      menuList: [
        { text: "New season", to: "#" },
        { text: "Most searched", to: "#" },
        { text: "Most selled", to: "#" },
      ],
    },
    {
      title: "Info",
      menuList: [
        { text: "Contact Us", to: "#" },
        { text: "Privacy Policies", to: "#" },
        { text: "Terms & Conditions", to: "#" },
      ],
    },
    {
      title: "About",
      menuList: [
        { text: "Help", to: "#" },
        { text: "Shipping", to: "#" },
        { text: "Affiliate", to: "#" },
      ],
    },
  ];

  return (
    <Box as="footer" w="100%">
      <Box pt="32px" pb="85px" bgColor="#272727" w="100%">
        <Container maxW="container.xl">
          <Divider colorScheme="whiteAlpha" />
          <Stack
            direction={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <VStack alignItems="start">
              <Image w="150" src={Logo} alt="Logo" />
              <Text color="white" width={{ base: "none", lg: "270px" }}>
                Your natural candle made for your home and for your wellness.
              </Text>
            </VStack>
            <SimpleGrid
              columns={{ base: 2, lg: 3 }}
              mt="58px"
              spacingX={{ base: "none", lg: "50px" }}
              spacingY={{ base: "42px", lg: "0px" }}
            >
              {menus.map((menu, index) => (
                <FooterMenu key={index} {...menu} />
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
      <Box w="full" p="24px" bgColor="#E5E5E5">
        <Text color="#5E6E89" textAlign="center">
          ©Candleaf All Rights Reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
