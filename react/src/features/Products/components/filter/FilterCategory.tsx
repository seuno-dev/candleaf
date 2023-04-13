import { useCategoryList } from "../../../../hooks/useCategoryList";
import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import FilterCategoryButton from "./FilterCategoryButton";

interface Props {
  onCategoryClick: (id: number | null) => void;
}

function FilterCategory({ onCategoryClick }: Props) {
  const { categories } = useCategoryList();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategoryClick = (selectedBefore: boolean, id: number) => {
    if (selectedBefore) {
      setSelectedCategory(null);
      onCategoryClick(null);
    } else {
      setSelectedCategory(id);
      onCategoryClick(id);
    }
  };

  return (
    <div>
      <Typography variant="h6" className="mb-3">
        Category
      </Typography>
      {categories.map((category) => (
        <FilterCategoryButton
          key={category.id}
          text={category.title}
          selected={selectedCategory === category.id}
          onClick={() =>
            handleCategoryClick(selectedCategory === category.id, category.id)
          }
        />
      ))}
    </div>
  );
}

export default FilterCategory;
