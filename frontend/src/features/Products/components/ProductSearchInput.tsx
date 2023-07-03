import React, { useState } from "react";
import { Box, Input, VStack } from "@chakra-ui/react";

interface Props {
  onSubmit: (titleQuery: string) => void;
}

const ProductSearchInput = ({ onSubmit }: Props) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <Box w="full">
      <form onSubmit={handleSubmit}>
        <VStack>
          <Input
            variant="flushed"
            placeholder="Search by title"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
        </VStack>
      </form>
    </Box>
  );
};

export default ProductSearchInput;
