import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import FilterPriceInput from "./FilterPriceInput";

interface Props {
  onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
}

function FilterPrice({ onPriceFilter }: Props) {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  return (
    <div>
      <Typography variant="h6" className="mb-3">
        Price
      </Typography>
      <div className="flex flex-col gap-3">
        <FilterPriceInput
          placeholder="Minimum price"
          onChange={(value) => setMinPrice(value)}
        />
        <FilterPriceInput
          placeholder="Maximum price"
          onChange={(value) => setMaxPrice(value)}
        />
        <Button
          fullWidth={true}
          color="light-green"
          onClick={() => onPriceFilter(minPrice, maxPrice)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

export default FilterPrice;
