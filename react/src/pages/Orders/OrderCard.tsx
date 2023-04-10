import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { OrderResponse } from "../../services/api";

type OrderItemProps = {
  order: OrderResponse;
};

function OrderCard({ order }: OrderItemProps) {
  const items = order.items;
  const firstItem = items[0];

  return (
    <Card className="px-2 border-[0.5px] border-gray-200" shadow={false}>
      <CardHeader floated={false} shadow={false}>
        {order.order_time.split("T")[0]}
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
            {firstItem.quantity} x ${firstItem.unit_price}
          </Typography>
          {items.length > 1 && (
            <Typography variant="paragraph" className="mt-2">
              + {items.length - 1} other items
            </Typography>
          )}
        </div>
        <div className="flex flex-col">
          <Typography variant="paragraph">Total price</Typography>
          <Typography variant="h6">
            {order.total_price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderCard;
