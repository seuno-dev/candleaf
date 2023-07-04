import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import OrderFilter from "../components/OrderFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOrderList from "../hooks/useOrderList";
import { Box, Button, useDisclosure } from "@chakra-ui/react";

function OrderList() {
  const [dateFilter, setDateFilter] = useState({
    orderTimeMin: "",
    orderTimeMax: "",
  });
  const { data: orders } = useOrderList(dateFilter);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSubmit = (dateMin: string, dateMax: string) => {
    searchParams.set("order_time_min", dateMin ? dateMin : "");
    searchParams.set("order_time_max", dateMax ? dateMax : "");
    navigate({
      pathname: "/orders",
      search: searchParams.toString(),
    });
    onClose();
  };

  useEffect(() => {
    setDateFilter({
      orderTimeMin: searchParams.get("order_time_min") || "",
      orderTimeMax: searchParams.get("order_time_max") || "",
    });
  }, [searchParams]);

  return (
    <Box
      maxW={{ base: "full", md: "container.xl" }}
      mx={{ base: "15px", md: "auto" }}
      pb="30px"
    >
      <Box textAlign="right" mb={{ base: "10px", md: 0 }}>
        <Button colorScheme="primary" onClick={onOpen}>
          Date Filter
        </Button>
      </Box>
      <OrderFilter
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        dateFilter={dateFilter}
      />
      <ul>
        {orders?.results.map((order) => (
          <li key={order.id} className="mb-2">
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default OrderList;
