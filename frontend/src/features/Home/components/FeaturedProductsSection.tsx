import React from "react";
import { Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import useFeaturedProducts from "../hooks/useFeaturedProducts";
import FeaturedProductCard from "./FeaturedProductCard";

const FeaturedProductsSection = () => {
  const { data } = useFeaturedProducts();

  return (
    <VStack w="full" py="90px" justifyContent="center">
      <Heading fontWeight="normal">Products</Heading>
      <Text fontSize={18} color="#5E6E89">
        Order it for you or for your beloved ones
      </Text>
      <SimpleGrid
        columns={4}
        mt="60px"
        spacing="30px"
      >
        {data?.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default FeaturedProductsSection;
