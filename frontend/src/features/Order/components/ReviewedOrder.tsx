import React from "react";
import {OrderItem} from "../types";
import {
  Box, Divider, HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack, Text
} from "@chakra-ui/react";
import ReviewStarLabel from "../../../components/ReviewStarLabel";

interface Props{
    isOpen: boolean,
    onClose: () => void,
    orderItems: OrderItem[],
}

const ReviewedOrder = ({isOpen, onClose, orderItems}:Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>My Reviews</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack divider={<Divider/>}>
            {orderItems.map(item =>
              <Stack key={item.id}>
                <HStack
                  my="15px"
                  overflow="hidden"
                  border="1px"
                  borderRadius="5px"
                  borderColor="primary"
                >
                  <Image
                    src={item.product.image.image}
                    alt={`Image of ${item.product.title}`}
                    bgColor="#F7F8FA"
                    maxW="50px"
                  />
                  <Text ml="10px" fontSize={{base:"sm", md:"md"}}>
                    {item.product.title}
                  </Text>
                </HStack>
                {item.review && <ReviewStarLabel review={item.review}/>}
                {item.review?.comment &&
                  <Box mb="15px">
                    <Text>Review:</Text>
                    <Text>{item.review?.comment}</Text>
                  </Box>}
              </Stack>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ReviewedOrder;
