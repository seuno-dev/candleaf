import { Typography } from "@material-tailwind/react";
import React from "react";

interface Props {
  statusKey: string;
}

function OrderStatusLabel({ statusKey }: Props) {
  if (statusKey === "a") {
    return (
      <div className="bg-orange-200 px-2 py-1 rounded-md">
        <Typography variant="small">Awaiting Payment</Typography>
      </div>
    );
  } else if (statusKey === "b") {
    return (
      <div className="bg-light-green-500 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Processed
        </Typography>
      </div>
    );
  } else if (statusKey === "c") {
    return (
      <div className="bg-blue-800 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Shipped
        </Typography>
      </div>
    );
  } else if (statusKey === "d") {
    return (
      <div className="bg-light-green-500 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Completed
        </Typography>
      </div>
    );
  } else if (statusKey === "p") {
    return (
      <div className="bg-red-900 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Cancelled
        </Typography>
      </div>
    );
  } else {
    return <></>;
  }
}

export default OrderStatusLabel;