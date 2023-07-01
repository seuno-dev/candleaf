import React from "react";
import { Badge } from "@chakra-ui/react";

interface Props {
  statusKey: string;
}

function OrderStatusLabel({ statusKey }: Props) {
  if (statusKey === "a") {
    return (
      <Badge colorScheme="orange" px={2} py={1}>
        Awaiting Payment
      </Badge>
    );
  } else if (statusKey === "b") {
    return (
      <Badge colorScheme="green" px={2} py={1}>
        Processed
      </Badge>
    );
  } else if (statusKey === "c") {
    return (
      <Badge colorScheme="blue" px={2} py={1}>
        Shipped
      </Badge>
    );
  } else if (statusKey === "d") {
    return (
      <Badge px={2} py={1}>
        Completed
      </Badge>
    );
  } else if (statusKey === "p") {
    return (
      <Badge colorScheme="red" px={2} py={1}>
        Cancelled
      </Badge>
    );
  } else {
    return <></>;
  }
}

export default OrderStatusLabel;
