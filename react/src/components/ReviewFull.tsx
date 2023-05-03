import React from "react";
import Typography from "@material-tailwind/react/components/Typography";
import { SimpleReview } from "../types";
import ReviewStarLabel from "./ReviewStarLabel";

interface Props {
  review: SimpleReview;
}

const ReviewFull = ({ review }: Props) => {
  return (
    <div className="flex flex-col">
      <ReviewStarLabel review={review} />
      <Typography className="mt-2">{review.comment}</Typography>
    </div>
  );
};

export default ReviewFull;
