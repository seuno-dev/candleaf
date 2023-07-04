import React, {useState} from "react";
import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {OrderItem} from "../types";
import AddReview from "./AddReview";

interface Props{
  isOpen: boolean,
  onClose: () => void,
  orderItems: OrderItem[],
}

const ReviewModal = ({isOpen, onClose, orderItems}:Props) => {
  const [itemIndex, setItemIndex] = useState<number>(0);
  const item = orderItems[itemIndex];
  const onCloseReview = () => {onClose(); setItemIndex(0);};
  return (
    <Modal isOpen={isOpen} onClose={onCloseReview}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Review Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddReview orderItem={item} onSubmit={() => itemIndex === orderItems.length-1 ? onCloseReview() : setItemIndex(itemIndex+1)}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ReviewModal;
