import React, { useState } from "react";
import { formatCurrency } from "../../../utils/currency";
import { Order } from "../types";
import OrderStatusLabel from "./OrderStatusLabel";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text, useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReviewModal from "./ReviewModal";
import OrderItemRow from "./OrderItemRow";

type OrderItemProps = {
  order: Order;
};

function OrderCard({ order }: OrderItemProps) {
  const [openDetail, setOpenDetail] = useState(false);
  const items = openDetail ? order.items : [order.items[0]];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nullReviewItems = order.items.filter(item => item.review === null);
  const navigate = useNavigate();

  return (
    <Card
      variant="outline"
      p={{ base: "10px", md: "20px" }}
      my={{ md: "20px" }}
    >
      <HStack justifyContent="space-between">
        <Text>{order.orderTime.split("T")[0]}</Text>
        <HStack>
          <OrderStatusLabel statusKey={order.status} />
          {order.status === "a" && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem>Cancel order</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </HStack>
      <Stack divider={<Divider />}>
        {items.map((item) => (
          <OrderItemRow item={item} key={item.id}/>
        ))}
      </Stack>
      {openDetail && (
        <IconButton
          icon={<ChevronUpIcon />}
          aria-label="See Less"
          variant="ghost"
          my="5px"
          onClick={() => setOpenDetail(false)}
        />
      )}
      {order.items.length > 1 && !openDetail && (
        <Stack spacing={0}>
          <Text textAlign="right">
            + {order.items.length - 1} other item(s)
          </Text>
          <IconButton
            icon={<ChevronDownIcon />}
            aria-label="See Detail"
            variant="ghost"
            onClick={() => setOpenDetail(true)}
          />
        </Stack>
      )}
      <Divider />
      <HStack justifyContent="end" mt="10px">
        <Box textAlign="right">
          <Text>Total price</Text>
          <Text>{formatCurrency(order.totalPrice)}</Text>
        </Box>
        <Box>
          {order.status === "a" && (
            <Button
              colorScheme="primary"
              ml={{ md: "20px" }}
              onClick={() =>
                navigate("/payment/", { state: { orderId: order.id } })
              }>
              Complete payment
            </Button>
          )}
          {order.status === "d" && nullReviewItems.length > 0 && (
            <Button
              color="primary"
              ml={{ md: "20px" }}
              variant="outline"
              onClick={onOpen}
            >
              Leave Review{order.items.length !== 1 && "s"}
            </Button>
          )}
          <ReviewModal orderItems={nullReviewItems} isOpen={isOpen} onClose={onClose}/>
        </Box>
      </HStack>
    </Card>
  );
}

export default OrderCard;
