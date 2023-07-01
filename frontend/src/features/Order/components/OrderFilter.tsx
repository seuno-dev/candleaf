import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import { OrderTimeFilter } from "../types";

interface Props {
  dateFilter: OrderTimeFilter;
  handleSubmit: (dateMin: string, dateMax: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const OrderFilter = ({
  dateFilter: orderTime,
  handleSubmit,
  isOpen,
  onClose,
}: Props) => {
  const [dateFilter, setDateFilter] = useState({
    orderTimeMin: "",
    orderTimeMax: "",
  });
  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter({ ...dateFilter, [e.target.id]: e.target.value });
  };
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Date Filter</DrawerHeader>
        <DrawerBody>
          <Stack alignItems="end" spacing="15px">
            <InputGroup size="sm" borderColor="primary">
              <InputLeftAddon bgColor="primary" color="white">
                From
              </InputLeftAddon>
              <Input
                id="orderTimeMin"
                focusBorderColor="primary"
                _hover={{ borderColor: "primaryDarker" }}
                type="date"
                value={dateFilter.orderTimeMin || orderTime.orderTimeMin}
                onChange={handleDateFilter}
              />
            </InputGroup>
            <InputGroup size="sm" borderColor="primary">
              <InputLeftAddon bgColor="primary" color="white">
                To
              </InputLeftAddon>
              <Input
                id="orderTimeMax"
                focusBorderColor="primary"
                _hover={{ borderColor: "primaryDarker" }}
                type="date"
                value={dateFilter.orderTimeMax || orderTime.orderTimeMax}
                onChange={handleDateFilter}
              />
            </InputGroup>
            <Button
              variant="outline"
              color="primary"
              borderRadius={0}
              size="sm"
              w="70px"
              py="16px"
              onClick={() =>
                handleSubmit(dateFilter.orderTimeMin, dateFilter.orderTimeMax)
              }
            >
              Filter
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default OrderFilter;
