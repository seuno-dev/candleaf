import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { toCurrencyString } from "../../utils/currency";
import { OrderItemResponse } from "../../services/api";

type OrderItemCardProps = {
  item: OrderItemResponse;
}
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
            {item.quantity} x {toCurrencyString(item.unit_price)}
          </Typography>
        </div>
        <div className="flex flex-col">
          <Typography variant="paragraph">Total price:</Typography>
          <Typography variant="h6">
            {toCurrencyString(item.total_price)}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderItemCard;