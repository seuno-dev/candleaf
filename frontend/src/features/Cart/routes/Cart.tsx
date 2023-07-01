import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItemRow from "../components/CartItemRow";
import { submitOrder } from "../../Order/api";
import useCartItems from "../hooks/useCartItems";
import { formatCurrency } from "../../../utils/currency";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getTotalPrice } from "../util";

function Cart() {
  const { data } = useCartItems();
  const navigate = useNavigate();

  const createOrder = async () => {
    return await submitOrder();
  };

  const handleCreateOrderClick = async () => {
    const orderId = await createOrder();
    navigate("/payment/", { state: { orderId: orderId } });
  };

  const totalPrice = data ? getTotalPrice(data) : 0;

  return (
    <Stack
      maxW={{ base: "full", md: "container.xl" }}
      pb="100px"
      px="15px"
      mx={{ md: "auto" }}
    >
      <Box>
        <Stack width="full" py="70px" align="center">
          <Text fontSize="3xl">Your cart items</Text>
          <Link to="/products">
            <Text as="u" color="primary" fontSize="xl">
              Back to shopping
            </Text>
          </Link>
        </Stack>
        <Box>
          <HStack justifyContent="space-between" mb="15px" hideFrom="md">
            <Text>Product</Text>
            <Text>Price</Text>
          </HStack>
          <Grid templateColumns="repeat(12, 1fr)" mb="15px" hideBelow="md">
            <GridItem colSpan={7}>
              <Text>Product</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text>Price</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text>Quantity</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text align="end">Sub-total</Text>
            </GridItem>
          </Grid>
          <Divider />
          <Box>
            {data?.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </Box>
        </Box>
      </Box>
      <Stack textAlign="center" hideFrom="md">
        <Text fontSize="xl" mt="30px">
          Total {formatCurrency(totalPrice)}
        </Text>
        <Text mb="30px" color="grey">
          Tax and shipping cost will be calculated later
        </Text>
        <Button
          w="full"
          colorScheme="primary"
          borderRadius="5px"
          size="md"
          height="50px"
          onClick={handleCreateOrderClick}
        >
          Checkout
        </Button>
      </Stack>
      <HStack justifyContent="end" hideBelow="md" my="30px">
        <Stack textAlign="end" mr="40px">
          <Text fontSize="xl">Total {formatCurrency(totalPrice)}</Text>
          <Text color="grey">
            Tax and shipping cost will be calculated later
          </Text>
        </Stack>
        <Button
          colorScheme="primary"
          borderRadius="5px"
          size="md"
          w="180px"
          h="50px"
          onClick={handleCreateOrderClick}
        >
          Checkout
        </Button>
      </HStack>
    </Stack>
  );
}

export default Cart;
