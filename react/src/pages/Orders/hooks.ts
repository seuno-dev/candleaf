import { useEffect, useState } from "react";
import { OrderResponse, retrieveOrderList } from "../../services/api";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    retrieveOrderList().then((orders) => {
      setOrders(orders);
    });
  }, []);

  return { orders };
};
