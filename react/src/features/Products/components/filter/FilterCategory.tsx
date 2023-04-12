import { useCategoryList } from "../../../../hooks/useCategoryList";
import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import FilterCategoryButton from "./FilterCategoryButton";

interface Props {
  onCategoryClick: (id: number) => void;
}

function FilterCategory({ onCategoryClick }: Props) {
  const { categories } = useCategoryList();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
    onCategoryClick(id);
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
          isSelected={selectedCategory === category.id}
          onClick={() => handleCategoryClick(category.id)}
        />
      ))}
    </div>
  );
}

export default FilterCategory;
