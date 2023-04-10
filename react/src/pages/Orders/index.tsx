import React, { useState } from "react";
import { useOrders } from "./hooks";
import OrderCard from "./OrderCard";
import {
  Card,
  CardBody,
  Dialog,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import { OrderResponse } from "../../services/api";
import { toCurrencyString } from "../../utils/currency";

function Orders() {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [openDetailDialog, setOpenDetailDialog] = useState(true);
  const handleOpenDetailDialog = () => setOpenDetailDialog(!open);

  const handleClickDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  return (
    <div className="container mx-auto mt-5">
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            <OrderCard order={order} handleClickDetail={handleClickDetail} />
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <Dialog
          open={openDetailDialog}
          handler={handleOpenDetailDialog}
          className="flex flex-col"
        >
          <DialogBody>
            <ul>
              {selectedOrder.items.map((item) => (
                <li
                  key={item.id}
                  className="mb-2 border-[0.5px] border-gray-200"
                >
                  <Card shadow={false}>
                    <CardBody className="flex flex-row">
                      <img
                        src={item.product.image.image}
                        alt={`Image of ${item.product.title}`}
                        className="w-12 rounded-lg"
                      />
                      <div className="w-[350px] ml-2 flex flex-col">
                        <Typography variant="h6">
                          {item.product.title}
                        </Typography>
                        <Typography variant="paragraph">
                          {item.quantity} x {toCurrencyString(item.unit_price)}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography variant="paragraph">
                          Total price:
                        </Typography>
                        <Typography variant="h6">
                          {toCurrencyString(item.total_price)}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
}

export default Orders;
