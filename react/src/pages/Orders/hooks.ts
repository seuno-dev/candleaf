import { useEffect, useState } from "react";
import { retrieveOrderList } from "../../api/api";
import { Order } from "../../types";

export const useOrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    retrieveOrderList().then((orderList) => {
      setOrders(orderList.results);
      setTotalPages(orderList.totalPages);
    });
  }, []);

  return { orders, totalPages };
};
