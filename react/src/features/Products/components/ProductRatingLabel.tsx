import React from "react";
import Star from "../../../assets/images/star.svg";
import { Typography } from "@material-tailwind/react";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductRatingLabel = ({ product }: Props) => {
  return (
    <div className="flex flex-row items-center">
      <img src={Star} className="w-4" alt="review icon" />
      <Typography className="ml-2">
        {product.averageRating} ({product.ratingCount} ratings)
      </Typography>
    </div>
  );
};

export default ProductRatingLabel;
