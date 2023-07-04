import React from "react";
import {OrderItem} from "../types";
import {Box, HStack, Image, Text} from "@chakra-ui/react";
import {formatCurrency} from "../../../utils/currency";
import {Link} from "react-router-dom";

interface Props{
  item: OrderItem;
}
const OrderItemRow = ({item}:Props) => {
  return (
    <Link to={"/products/"+item.product.slug}>
      <HStack
        _hover={{bg:"#EFEFEF", transition: "background-color 0.05s", borderRadius:"10px"}}
        overflow="hidden"
        justifyContent={{ base: "space-between", md: "start" }}
        my="15px"
      >
        <Image
          src={item.product.image.image}
          alt={`Image of ${item.product.title}`}
          bgColor="#F7F8FA"
          maxW={{ base: "100px", md: "120px" }}
        />
        <Box textAlign={{ base: "right", md: "left" }} ml={{ md: "30px" }}>
          <Text fontSize={{ base: "lg", md: "xl" }}>
            {item.product.title}
          </Text>
          <Text>
            {item.quantity} x {formatCurrency(item.unitPrice)}
          </Text>
        </Box>
      </HStack>
    </Link>
  );
};
export default OrderItemRow;
