import React, { useState } from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useCategoryList } from "../../../hooks/useCategoryList";

interface CategoryButtonProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryButton({ text, isSelected, onClick }: CategoryButtonProps) {
  return isSelected ? (
    <Button
      variant="text"
      color="gray"
      fullWidth={true}
      className="text-left"
      disabled={true}
      ripple={false}
      onClick={onClick}
    >
      <Typography className="normal-case text-black font-bold">{text}</Typography>
    </Button>
  ) : (
    <Button
      variant="text"
      color="gray"
      fullWidth={true}
      className="w-full text-left"
      ripple={false}
      onClick={onClick}
    >
      <Typography className="normal-case font-normal">{text}</Typography>
    </Button>
  );
}

function FilterSideBar() {
  const { categories } = useCategoryList();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
  };

  return (
    <Card className="w-full border-[0.5px] border-gray-200" shadow={false}>
      <CardBody>
        <div>
          <Typography variant="h6">Category</Typography>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              text={category.title}
              isSelected={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default FilterSideBar;
