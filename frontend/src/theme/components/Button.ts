import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  baseStyle: {
    fontFamily: "Roboto, sans-serif",
  },
  sizes: {
    sm: {
      fontSize: 16,
      fontWeight: 500,
      px: 40,
    },
    md: {
      fontSize: 20,
      fontWeight: 500,
      px: 50,
    },
  },
  variants: {
    solid: {
      backgroundColor: "primary",
      color: "#FFFFFF",
      _hover: {
        backgroundColor: "primaryDarker",
      },
      _active: {
        backgroundColor: "primaryDarkest",
      },
    },
  },
});

export default Button;
