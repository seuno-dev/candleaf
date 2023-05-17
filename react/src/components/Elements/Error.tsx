import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

const Error = () => {
  const error = useRouteError();
  return (
    <div>
      <Typography variant="h5">Oops</Typography>
      <Typography>
        {isRouteErrorResponse(error)
          ? "The page doesn't exist"
          : "Something unexpected happened"}
      </Typography>
    </div>
  );
};

export default Error;
