import { defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

const Input = defineStyleConfig({
  baseStyle: {
    focusBorderColor: colors.primary,
  },
});

export default Input;
