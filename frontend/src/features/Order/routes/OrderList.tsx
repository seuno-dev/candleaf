import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { Order } from "../types";
import OrderDetailDialog from "../components/OrderDetailDialog";
import OrderFilter from "../components/OrderFilter";
import {useNavigate, useSearchParams} from "react-router-dom";
import useOrderList from "../hooks/useOrderList";

function OrderList() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(true);
  const [dateFilter, setDateFilter] = useState({orderTimeMin:"", orderTimeMax:""});
  const {data:orders} = useOrderList(dateFilter);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleOpenDetailDialog = () => setOpenDetailDialog(!open);

  const handleClickDetail = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  const handleSubmit = (dateMin:string, dateMax:string) => {
    searchParams.set("order_time_min", dateMin ? dateMin : "");
    searchParams.set("order_time_max", dateMax ? dateMax : "");
    navigate({
      pathname: "/orders",
      search: searchParams.toString(),
    });
  };

  useEffect(() =>  {
    setDateFilter({
      orderTimeMin: searchParams.get("order_time_min")||"",
      orderTimeMax: searchParams.get("order_time_max")||""
    });
  }, [searchParams]);


  return (
    <div className="container mx-auto mt-5">
      <OrderFilter handleSubmit={handleSubmit} dateFilter={dateFilter}/>
      <ul>
        {orders?.results.map((order) => (
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
