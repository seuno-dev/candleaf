import React from "react";
import { Button, Option, Select, Textarea } from "@material-tailwind/react";

const AddReview = () => {
  return (
    <div className="flex flex-col gap-3">
      <Select label="Ratings" color="light-green">
        <Option>1 star</Option>
        <Option>2 stars</Option>
        <Option>3 stars</Option>
        <Option>4 stars</Option>
        <Option>5 stars</Option>
      </Select>
      <Textarea label="Comment" color="light-green" />
      <Button color="light-green" fullWidth={true}>
        Submit
      </Button>
    </div>
  );
};

export default AddReview;
