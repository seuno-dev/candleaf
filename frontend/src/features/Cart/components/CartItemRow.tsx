import React from "react";
import { formatCurrency } from "../../../utils/currency";
import { CartItem } from "../types";
import useUpdateCartItem from "../hooks/useUpdateCartItem";
import useDeleteCartItem from "../hooks/useDeleteCartItem";
import {
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

type CartItemProps = {
  item: CartItem;
};

function CartItemRow({ item }: CartItemProps) {
  const { mutate: update } = useUpdateCartItem();
  const { mutate: remove } = useDeleteCartItem();

  return (
    <>
      <Grid
        templateColumns={{ base: "repeat(4, 1fr)", md: "repeat(12, 1fr)" }}
        templateRows={{ md: "repeat(3, 35px)" }}
        py="30px"
      >
        <GridItem mr="5px" rowSpan={{ md: 3 }} colSpan={{ md: 2 }}>
          <Image
            src={
              item.product.image.image == ""
                ? "logo512.png"
                : item.product.image.image
            }
            bgColor="#F7F8FA"
            maxW={{ base: "80px", md: "150px" }}
            alt={`Image of ${item.product.title}`}
            justifyContent="center"
          />
        </GridItem>
        <GridItem />
        <GridItem
          colSpan={{ base: 2, md: 5 }}
          colStart={{ base: 2, md: 3 }}
          rowStart={1}
        >
          <Text fontSize={{ base: "lg", md: "xl" }}>{item.product.title}</Text>
        </GridItem>
        <GridItem
          colSpan={{ md: 2 }}
          rowStart={{ base: 1, md: 2 }}
          colStart={{ base: 4, md: 8 }}
        >
          <Text textAlign={{ base: "end", md: "start" }}>
            {formatCurrency(item.product.unitPrice)}
          </Text>
        </GridItem>
        <GridItem
          colStart={{ base: 2, md: 3 }}
          colSpan={{ base: 2, md: 5 }}
          rowStart={{ md: 2 }}
        >
          <Button
            variant="link"
            onClick={() => remove(item)}
            color="primary"
            className="underline"
          >
            Remove
          </Button>
        </GridItem>
        <GridItem rowStart={{ md: 2 }} colStart={{ md: 10 }}>
          <Text textAlign="end" hideFrom="md">
            Quantity
          </Text>
          <HStack
            border="1px"
            borderColor="primary"
            w="75px"
            ml={{ base: "auto", md: "0" }}
          >
            <Button
              variant="ghost"
              isDisabled={item.quantity == 1}
              onClick={() => update({ ...item, quantity: item.quantity - 1 })}
              p={0}
              minW="25px"
              borderRadius={0}
              color="primary"
            >
              -
            </Button>
            <Text>{item.quantity}</Text>

            <Button
              variant="ghost"
              onClick={() => update({ ...item, quantity: item.quantity + 1 })}
              isDisabled={item.quantity == item.product.inventory}
              p={0}
              minW="25px"
              borderRadius={0}
              color="primary"
            >
              +
            </Button>
          </HStack>
        </GridItem>
        <GridItem hideBelow="md" colStart={12} rowStart={{ md: 2 }}>
          <Text align="end">{formatCurrency(item.totalPrice)}</Text>
        </GridItem>
      </Grid>
      <Divider />
    </>
  );
}

export default CartItemRow;
