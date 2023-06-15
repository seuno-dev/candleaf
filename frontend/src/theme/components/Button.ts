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
      backgroundColor: "#56B280",
      color: "#FFFFFF",
      _hover: {
        backgroundColor: "#358f5e",
      },
      _active: {
        backgroundColor: "#1d653e",
      },
    },
  },
});

export default Button;
