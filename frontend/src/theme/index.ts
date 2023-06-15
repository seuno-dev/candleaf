import { extendTheme } from "@chakra-ui/react";
import Button from "./components/Button";
import Link from "./components/Link";

const navbarH = "80px";

const theme = extendTheme({
  space: {
    navbarH,
  },
  sizes: {
    navbarH,
    sectionH: `calc(100vh - ${navbarH})`,
  },
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
