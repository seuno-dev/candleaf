import React from "react";
import FilterNumber from "./FilterNumber";
import { Box, Heading, VStack } from "@chakra-ui/react";

interface Props {
  minBurningTime: string | null;
  maxBurningTime: string | null;
  onBurningTimeFilter: (
    minPrice: number | null,
    maxPrice: number | null
  ) => void;
  minPrice: string | null;
  maxPrice: string | null;
  onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
}

function FilterSideBar({
  minBurningTime,
  maxBurningTime,
  onBurningTimeFilter,
  minPrice,
  maxPrice,
  onPriceFilter,
}: Props) {
  return (
    <VStack w="full" rounded="lg" alignItems="start">
      <Heading size="md">Filter</Heading>
      <Box w="full">
        <FilterNumber
          title="Burning time"
          onApply={onBurningTimeFilter}
          min={minBurningTime}
          max={maxBurningTime}
        />
      </Box>
      <Box mt="40px" w="full">
        <FilterNumber
          title="Price"
          onApply={onPriceFilter}
          min={minPrice}
          max={maxPrice}
        />
      </Box>
    </VStack>
  );
}

export default FilterSideBar;
