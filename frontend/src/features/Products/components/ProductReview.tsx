import React from "react";
import { SimpleReview } from "../../../types";
import ReviewStarLabel from "../../../components/ReviewStarLabel";
import {Stack, Text} from "@chakra-ui/react";

interface Props {
  review: SimpleReview;
}

const ProductReview = ({ review }: Props) => {
  return (
    <Stack my="15px">
      <ReviewStarLabel review={review} />
      <Text mt={2}>{review.comment}</Text>
    </Stack>
  );
};

export default ProductReview;
