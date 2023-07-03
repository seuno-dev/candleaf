import { extendTheme } from "@chakra-ui/react";
import Button from "./components/Button";
import Link from "./components/Link";
import Heading from "./components/Heading";
import Input from "./components/Input";
import colors from "./colors";

const navbarH = "80px";

const theme = extendTheme({
  colors,
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
    Button,
    Heading,
    Input,
    Link,
  },
});

export default theme;
