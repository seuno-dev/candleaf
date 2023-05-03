import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { Order } from "../types";
import { retrieveOrderList } from "../api";
import OrderDetailDialog from "../components/OrderDetailDialog";

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
        <OrderDetailDialog
          order={selectedOrder}
          open={openDetailDialog}
          handler={handleOpenDetailDialog}
        />
      )}
    </div>
  );
}

export default OrderList;
