import React from "react";
import { Card, CardBody, CardHeader, Image, Text } from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/currency";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card minW="256px" variant="elevated" shadow="md">
      <CardHeader p={0} bgColor="#F7F8FA">
        <Image
          src={product.images[0].image}
          w="full"
          h={{ base: "100px", md: "150px" }}
          objectFit="cover"
          alt={"Image of " + product.title}
        />
      </CardHeader>
      <CardBody fontWeight="medium">
        <Text color="black">{product.title}</Text>
        <Text w="full" textAlign="right" color="primary">
          {formatCurrency(product.unitPrice)}
        </Text>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
