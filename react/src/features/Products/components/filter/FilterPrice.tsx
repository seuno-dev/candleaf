import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import FilterPriceInput from "./FilterPriceInput";

interface Props {
  minPrice: string | null;
  maxPrice: string | null;
  onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
}

function FilterPrice({
  onPriceFilter,
  minPrice: _minPrice,
  maxPrice: _maxPrice,
}: Props) {
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
          value={_minPrice}
          onChange={(value) => setMinPrice(value)}
        />
        <FilterPriceInput
          placeholder="Maximum price"
          value={_maxPrice}
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
