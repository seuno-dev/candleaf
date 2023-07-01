import React from "react";
import {
  Box,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { OrderItem } from "../../Order/types";
import { formatCurrency } from "../../../utils/currency";

interface Props {
  orderItem: OrderItem;
}

const OrderItemRow = ({ orderItem }: Props) => {
  return (
    <HStack w="full" alignItems="start">
      <Box position="relative" h="120px" w="35%">
        <Image
          w="full"
          h="full"
          objectFit="cover"
          src={orderItem.product.image.image}
          alt={"Image of " + orderItem.product.title}
        />
        <Stack
          position="absolute"
          zIndex="100"
          top={-2}
          right={-2}
          w="22px"
          h="22px"
          bgColor="primary"
          textColor="white"
          p="10px"
          borderRadius="full"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="sm">{orderItem.quantity}</Text>
        </Stack>
      </Box>
      <Spacer w="10%" />
      <VStack w="55%" alignItems="start">
        <Text fontSize="lg">{orderItem.product.title}</Text>
        <Text fontSize="lg" color="primary" fontWeight="semibold">
          {formatCurrency(orderItem.totalPrice)}
        </Text>
      </VStack>
    </HStack>
  );
};

export default OrderItemRow;
