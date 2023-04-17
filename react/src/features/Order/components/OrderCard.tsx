import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { formatCurrency } from "../../../utils/currency";
import { Order } from "../types";

interface PaymentStatusLabelProp {
  paymentStatusKey: string;
}

function PaymentStatusLabel({ paymentStatusKey }: PaymentStatusLabelProp) {
  if (paymentStatusKey === "P") {
    return (
      <div className="bg-orange-200 px-2 py-1 rounded-md">
        <Typography variant="small">Pending</Typography>
      </div>
    );
  } else if (paymentStatusKey === "C") {
    return (
      <div className="bg-light-green-500 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Completed
        </Typography>
      </div>
    );
  } else if (paymentStatusKey === "F") {
    return (
      <div className="bg-red-900 px-2 py-1 rounded-md">
        <Typography variant="small" className="text-white">
          Failed
        </Typography>
      </div>
    );
  } else {
    return <></>;
  }
}

type OrderItemProps = {
  order: Order;
  handleClickDetail: (order: Order) => void;
};

function OrderCard({ order, handleClickDetail }: OrderItemProps) {
  const items = order.items;
  const firstItem = items[0];

  return (
    <Card className="border-[0.5px] border-gray-200" shadow={false}>
      <CardHeader
        className="mx-6 flex flex-row items-center"
        floated={false}
        shadow={false}
      >
        <Typography>{order.orderTime.split("T")[0]}</Typography>
        <div className="ml-5">
          <PaymentStatusLabel paymentStatusKey={order.paymentStatus} />
        </div>
      </CardHeader>
      <CardBody className="flex flex-row">
        <img
          src={firstItem.product.image.image}
          alt={`Image of ${firstItem.product.title}`}
          className="w-20 h-20 rounded-lg"
        />
        <div className="flex flex-col ml-4 w-[950px]">
          <Typography variant="h6">{firstItem.product.title}</Typography>
          <Typography variant="paragraph">
            {firstItem.quantity} x {formatCurrency(firstItem.unitPrice)}
          </Typography>
          {items.length > 1 && (
            <Typography variant="paragraph" className="mt-2">
              + {items.length - 1} other item(s)
            </Typography>
          )}
        </div>
        <div className="flex flex-col">
          <Typography variant="paragraph">Total price</Typography>
          <Typography variant="h6">
            {formatCurrency(order.totalPrice)}
          </Typography>
          <Button
            className="mt-5"
            color="light-green"
            onClick={() => handleClickDetail(order)}
          >
            See details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderCard;
