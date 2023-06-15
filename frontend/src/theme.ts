import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "Poppins, sans-serif",
  },
  components: {
    Link: {
      baseStyle: {
        fontFamily: "Roboto, sans-serif",
        color: "black",
        _hover: {
          textDecoration: "normal"
        },
      },
    },
  },
});

export default theme;
