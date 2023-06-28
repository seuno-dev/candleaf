import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  baseStyle: {
    fontFamily: "Roboto, sans-serif",
  },
  defaultProps: {
    size: "sm",
    variant: "solid",
  },
  sizes: {
    sm: {
      fontSize: 16,
      fontWeight: 500,
      p: "20px",
    },
    md: {
      fontSize: 20,
      fontWeight: 500,
      p: "40px",
    },
  },
  variants: {
    solid: {
      backgroundColor: "primary",
      color: "#FFFFFF",
      _hover: {
        backgroundColor: "primaryDarker",
        _disabled: {
          backgroundColor: "primary",
        },
      },
      _active: {
        backgroundColor: "primaryDarkest",
      },
    },
  },
});

export default Button;
