import React from "react";
import { CreateReview, OrderItem } from "../types";
import { useMutation } from "@tanstack/react-query";
import { submitReview } from "../api";

const useAddReview = (
  orderItem: OrderItem,
  setOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>
) =>
  useMutation({
    mutationFn: (review: CreateReview) => {
      return submitReview(review);
    },
    onMutate: (newReview) => {
      setOrderItem({
        ...orderItem,
        review: { id: 1, rating: newReview.rating, comment: newReview.comment },
      });
      return orderItem;
    },
    onError: (error, newReview, orderItem) => {
      setOrderItem(orderItem || ({} as OrderItem));
    },
  });

export default useAddReview;
