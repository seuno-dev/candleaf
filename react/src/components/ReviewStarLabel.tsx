import React from "react";
import { SimpleReview } from "../types";
import Star from "../assets/images/star.svg";
import EmptyStar from "../assets/images/star-empty.svg";

interface Props {
  review: SimpleReview;
}

const ReviewStarLabel = ({ review }: Props) => {
  return (
    <div className="flex flex-row">
      {[...Array(review.rating)].map((_, i) => (
        <img className="w-4" src={Star} key={i} alt="Star icon" />
      ))}
      {[...Array(5 - review.rating)].map((_, i) => (
        <img className="w-4" src={EmptyStar} key={i} alt="Star icon" />
      ))}
    </div>
  );
};

export default ReviewStarLabel;
