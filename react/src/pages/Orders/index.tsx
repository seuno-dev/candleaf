import React from "react";
import { useOrders } from "./hooks";
import OrderCard from "./OrderCard";

function Orders() {
  const { orders } = useOrders();

  return (
    <div className="container mx-auto mt-5">
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
