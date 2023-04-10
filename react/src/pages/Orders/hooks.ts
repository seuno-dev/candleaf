import { useEffect, useState } from "react";
import { retrieveOrderList } from "../../api/api";
import { Order } from "../../types/store";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    retrieveOrderList().then((orderList) => {
      setOrders(orderList.data);
      setTotalPages(orderList.totalPages);
    });
  }, []);

  return { orders, totalPages };
};
