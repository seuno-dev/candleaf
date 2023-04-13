import React from "react";
import FilterCategory from "./FilterCategory";
import FilterPrice from "./FilterPrice";

interface Props {
  minPrice: string | null;
  maxPrice: string | null;
  selectedCategory: number | string | null;
  onCategorySelect: (id: number | null) => void;
  onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
}

function FilterSideBar({
  minPrice,
  maxPrice,
  selectedCategory,
  onCategorySelect,
  onPriceFilter,
}: Props) {
  const handleCategoryClick = (id: number | null) => {
    onCategorySelect(id);
  };

  return (
    <div className="w-[16rem] border-2 border-gray-200 rounded-lg">
      <div className="p-3">
        <FilterCategory
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="p-3 border-t-2 border-gray-200">
        <FilterPrice
          onPriceFilter={onPriceFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
    </div>
  );
}

export default FilterSideBar;
