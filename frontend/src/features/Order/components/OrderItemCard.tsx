import React, { useState } from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { formatCurrency } from "../../../utils/currency";
import { Order, OrderItem } from "../types";
import ReviewStarLabel from "../../../components/ReviewStarLabel";
import AddReview from "./AddReview";

type OrderItemCardProps = {
  order: Order;
  item: OrderItem;
};

function OrderItemCard({ order, item: _item }: OrderItemCardProps) {
  const [item, setItem] = useState(_item);
  const [isReviewing, setIsReviewing] = useState(false);

  return (
    <Card shadow={false}>
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-row justify-between items-center">
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
          {order.status == "d" &&
            !isReviewing &&
            (item.review != null ? (
              <div className="w-20">
                <ReviewStarLabel review={item.review} />
              </div>
            ) : (
              <Button color="light-green" onClick={() => setIsReviewing(true)}>
                Review
              </Button>
            ))}
        </div>
        {isReviewing && (
          <AddReview
            orderItem={item}
            setOrderItem={setItem}
            onSubmit={() => setIsReviewing(false)}
          />
        )}
      </CardBody>
    </Card>
  );
}

export default OrderItemCard;
