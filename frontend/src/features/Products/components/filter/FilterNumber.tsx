import React, { useState } from "react";
import FilterNumberInput from "./FilterNumberInput";
import { Box, Button, FormControl, Heading, VStack } from "@chakra-ui/react";

interface Props {
  title: string;
  min: string | null;
  max: string | null;
  onApply: (min: number | null, max: number | null) => void;
}

function FilterNumber({ title, min: _min, max: _max, onApply }: Props) {
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(min, max);
  };

  return (
    <Box w="full">
      <Heading mb="20px" size="sm" fontWeight="medium">
        {title}
      </Heading>
      <form onSubmit={onSubmit}>
        <VStack w="full">
          <FormControl>
            <FilterNumberInput
              placeholder="Minimum"
              value={_min}
              onChange={(value) => setMin(value)}
            />
          </FormControl>
          <FormControl>
            <FilterNumberInput
              placeholder="Maximum"
              value={_max}
              onChange={(value) => setMax(value)}
            />
          </FormControl>
          <FormControl>
            <Button size="sm" w="full" type="submit" p={0}>
              Apply
            </Button>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}

export default FilterNumber;
