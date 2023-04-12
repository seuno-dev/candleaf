import React from "react";
import { Card, CardBody } from "@material-tailwind/react";
import FilterCategory from "./FilterCategory";

function FilterSideBar() {
  const handleCategoryClick = (id: number) => {
    console.log(id);
  };

  return (
    <Card className="w-full border-[0.5px] border-gray-200" shadow={false}>
      <CardBody>
        <FilterCategory onCategoryClick={handleCategoryClick} />
      </CardBody>
    </Card>
  );
}

export default FilterSideBar;
