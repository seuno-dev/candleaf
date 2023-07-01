import React from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

function Fail() {
  return (
    <Box>
      <Container maxW="container.xl" py="60px">
        <VStack spacing="20px">
          <Heading>Payment Failed</Heading>
          <Text maxW="xl">
            Please check your payment method or try again later.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Fail;
