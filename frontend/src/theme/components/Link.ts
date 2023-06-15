import { defineStyleConfig } from "@chakra-ui/react";

const Link = defineStyleConfig({
  baseStyle: {
    fontFamily: "Roboto, sans-serif",
    color: "black",
    _hover: {
      textDecoration: "normal",
    },
  },
});

export default Link;
