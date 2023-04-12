import { Button, Typography } from "@material-tailwind/react";
import React from "react";

interface Props {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

function FilterCategoryButton({ text, isSelected, onClick }: Props) {
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
      <Typography className="normal-case text-black font-bold">
        {text}
      </Typography>
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

export default FilterCategoryButton;
