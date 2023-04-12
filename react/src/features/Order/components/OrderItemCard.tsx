import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { formatCurrency } from "../../../utils/currency";
import { OrderItem } from "../types";

type OrderItemCardProps = {
  item: OrderItem;
};

function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <Card shadow={false}>
      <CardBody className="flex flex-row">
        <img
          src={item.product.image.image}
          alt={`Image of ${item.product.title}`}
          className="w-12 rounded-lg"
        />
        <div className="w-[350px] ml-2 flex flex-col">
          <Typography variant="h6">{item.product.title}</Typography>
          <Typography variant="paragraph">
            {item.quantity} x {formatCurrency(item.unitPrice)}
          </Typography>
        </div>
        <div className="flex flex-col">
          <Typography variant="paragraph">Total price:</Typography>
          <Typography variant="h6">
            {formatCurrency(item.totalPrice)}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderItemCard;
