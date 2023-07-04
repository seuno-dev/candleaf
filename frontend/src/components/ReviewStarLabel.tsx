import React from "react";
import { SimpleReview } from "../types";
import Star from "../assets/images/star.svg";
import EmptyStar from "../assets/images/star-empty.svg";
import {HStack, Image} from "@chakra-ui/react";

interface Props {
  review: SimpleReview;
}

const ReviewStarLabel = ({ review }: Props) => {
  return (
    <HStack mb={1}>
      {[...Array(review.rating)].map((_, i) => (
        <Image w={4} src={Star} key={i} alt="Star icon" />
      ))}
      {[...Array(5 - review.rating)].map((_, i) => (
        <Image w={4} src={EmptyStar} key={i} alt="Star icon" />
      ))}
    </HStack>
  );
};

export default ReviewStarLabel;
