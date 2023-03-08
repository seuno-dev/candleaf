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
    <Card className="w-52" shadow={false}>
      <CardHeader floated={false} shadow={false}>
        <img src={imageUrl} alt={`Image of product ${title}`} />
      </CardHeader>
      <CardBody>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h6">${price}</Typography>
      </CardBody>
    </Card>
  );
}

export default ProductCard;
