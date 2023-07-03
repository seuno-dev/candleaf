import React, { useState } from "react";
import { OrderItem } from "../types";
import {
  Box,
  Button,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import useAddReview from "../hooks/useAddReview";

interface Props {
  orderItem: OrderItem;
  // setOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
  onSubmit: () => void;
}

const AddReview = ({ orderItem, onSubmit }: Props) => {
  const [item, setItem] = useState(orderItem);
  const { mutate } = useAddReview(item, setItem);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  return (
    <Stack mb="15px">
      <HStack
        key={orderItem.id}
        my="10px"
      >
        <Image
          src={orderItem.product.image.image}
          alt={`Image of ${orderItem.product.title}`}
          bgColor="#F7F8FA"
          maxW={{ base: "70px", md: "120px" }}
        />
        <Box textAlign="left" ml={{ md: "20px" }}>
          <Text fontSize={{ base: "lg", md: "xl" }}>
            {orderItem.product.title}
          </Text>
        </Box>
      </HStack>
      <Menu>
        <HStack>
          <Text>Rating:</Text>
          <MenuButton
            px={4}
            py={2}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px">
            {rating} star{rating !== 1 && "s"} <ChevronDownIcon />
          </MenuButton>
        </HStack>
        <Text>Review:</Text>
        <MenuList>
          <MenuItem onClick={()=>setRating(1)}>1 star</MenuItem>
          <MenuItem onClick={()=>setRating(2)}>2 stars</MenuItem>
          <MenuItem onClick={()=>setRating(3)}>3 stars</MenuItem>
          <MenuItem onClick={()=>setRating(4)}>4 stars</MenuItem>
          <MenuItem onClick={()=>setRating(5)}>5 stars</MenuItem>
        </MenuList>
      </Menu>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        colorScheme="primary"
        onClick={() => {
          mutate({ orderItem: orderItem.id, rating, comment });
          onSubmit();
          setRating(5);
          setComment("");
        }}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default AddReview;
