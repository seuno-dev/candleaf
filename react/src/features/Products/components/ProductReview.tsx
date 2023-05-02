import React from "react";
import { Review } from "../types";
import Star from "../../../assets/images/star.svg";
import EmptyStar from "../../../assets/images/star-empty.svg";
import { Typography } from "@material-tailwind/react";

interface Props {
  review: Review;
}

const ProductReview = ({ review }: Props) => {
  return (
    <div className="flex flex-row">
      {[...Array(review.rating)].map((_, i) => (
        <img className="w-4" src={Star} key={i} alt="Star icon" />
      ))}
      {[...Array(5 - review.rating)].map((_, i) => (
        <img className="w-4" src={EmptyStar} key={i} alt="Star icon" />
      ))}
      <Typography className="ml-3">{review.comment}</Typography>
    </div>
  );
};

export default ProductReview;
