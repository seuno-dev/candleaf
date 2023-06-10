import React, { useState } from "react";
import { Button, Option, Select, Textarea } from "@material-tailwind/react";
import useAddReview from "../hooks/useAddReview";
import { OrderItem } from "../types";

interface Props {
  orderItem: OrderItem;
  setOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
  onSubmit: () => void;
}

const AddReview = ({ orderItem, setOrderItem, onSubmit }: Props) => {
  const { mutate } = useAddReview(orderItem, setOrderItem);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <Select
        value={`${rating}`}
        onChange={(value) => setRating(parseInt(value || ""))}
        label="Ratings"
        color="light-green"
      >
        <Option value="1">1 star</Option>
        <Option value="2">2 stars</Option>
        <Option value="3">3 stars</Option>
        <Option value="4">4 stars</Option>
        <Option value="5">5 stars</Option>
      </Select>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        label="Comment"
        color="light-green"
      />
      <Button
        color="light-green"
        fullWidth={true}
        onClick={() => {
          mutate({ orderItem: orderItem.id, rating, comment });
          onSubmit();
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default AddReview;
