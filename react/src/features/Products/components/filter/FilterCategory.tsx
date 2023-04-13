import { useCategoryList } from "../../../../hooks/useCategoryList";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import FilterCategoryButton from "./FilterCategoryButton";

interface Props {
  selectedCategory: number | string | null;
  onCategoryClick: (id: number | null) => void;
}

function FilterCategory({
  selectedCategory: _selectedCategory,
  onCategoryClick,
}: Props) {
  const { categories } = useCategoryList();
  const [selectedCategory, setSelectedCategory] = useState<
    number | string | null
  >(_selectedCategory);

  useEffect(() => {
    setSelectedCategory(_selectedCategory);
  }, [_selectedCategory]);

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
          selected={selectedCategory == category.id}
          onClick={() =>
            handleCategoryClick(selectedCategory === category.id, category.id)
          }
        />
      ))}
    </div>
  );
}

export default FilterCategory;
