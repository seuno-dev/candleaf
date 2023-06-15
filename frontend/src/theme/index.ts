import { extendTheme } from "@chakra-ui/react";
import Button from "./components/Button";
import Link from "./components/Link";

const theme = extendTheme({
  fonts: {
    heading: "Poppins, sans-serif",
    subheading: "Helvetica, sans-serif",
    body: "Poppins, sans-serif",
  },
  components: {
    Link,
    Button,
  },
});

export default theme;
