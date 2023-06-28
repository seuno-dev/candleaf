import React from "react";
import FilterNumber from "./FilterNumber";

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
    <div className="w-[16rem] border-2 border-gray-200 rounded-lg">
      <div className="p-3">
        <FilterNumber
          title="Burning time"
          onApply={onBurningTimeFilter}
          min={minBurningTime}
          max={maxBurningTime}
        />
      </div>
      <div className="p-3 border-t-2 border-gray-200">
        <FilterNumber
          title="Price"
          onApply={onPriceFilter}
          min={minPrice}
          max={maxPrice}
        />
      </div>
    </div>
  );
}

export default FilterSideBar;
