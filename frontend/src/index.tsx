import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import "./index.css";
import App from "./App";
import { worker } from "./mocks/browser";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_SERVER === "msw"
) {
  worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
