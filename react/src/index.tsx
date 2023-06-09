import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import "./index.css";
import App from "./App";
// import { worker } from "./mocks/browser";
//
// if (process.env.NODE_ENV === "development" && process.env.SERVER === "msw") {
//   worker.start();
// }

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
