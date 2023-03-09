import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

type ProductCardProps = {
  title: string;
  price: number;
  imageUrl: string;
};

function ProductCard({ title, price, imageUrl }: ProductCardProps) {
  return (
    <Card
      className="w-52 border-[0.5px] border-gray-200"
      shadow={false}
    >
      <CardHeader className="m-0 rounded-b-none" floated={false} shadow={false}>
        <img src={imageUrl} alt={`Image of product ${title}`} />
      </CardHeader>
      <CardBody>
        <Typography className="line-clamp-2 break-words" variant="h6">
          {title}
        </Typography>
        <Typography variant="h6">${price}</Typography>
      </CardBody>
    </Card>
  );
}

export default ProductCard;
