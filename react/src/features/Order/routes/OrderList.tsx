import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { Dialog, DialogBody } from "@material-tailwind/react";
import OrderItemCard from "../components/OrderItemCard";
import { Order } from "../types";
import { retrieveOrderList } from "../api";

function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(true);

  useEffect(() => {
    retrieveOrderList().then((orderList) => {
      setOrders(orderList.results);
    });
  }, []);

  const handleOpenDetailDialog = () => setOpenDetailDialog(!open);

  const handleClickDetail = (order: Order) => {
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
                  <OrderItemCard item={item} />
                </li>
              ))}
            </ul>
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
}

export default OrderList;
