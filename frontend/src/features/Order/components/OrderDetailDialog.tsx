import React from "react";
import OrderItemCard from "./OrderItemCard";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { Order } from "../types";

interface Props {
  order: Order;
  open: boolean;
  handler: () => void;
}

const OrderDetailDialog = ({ order, open, handler }: Props) => {
  return (
    <Dialog open={open} handler={handler} className="flex flex-col">
      <DialogBody>
        <ul>
          {order.items.map((item) => (
            <li key={item.id} className="mb-2 border-[0.5px] border-gray-200">
              <OrderItemCard order={order} item={item} />
            </li>
          ))}
        </ul>
      </DialogBody>
    </Dialog>
  );
};

export default OrderDetailDialog;
