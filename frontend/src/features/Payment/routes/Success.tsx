import React from "react";
import { Box, Container, Heading, Image, Text, VStack } from "@chakra-ui/react";
import CheckIcon from "../../../assets/images/checkmark-bullet.svg";

function Success() {
  return (
    <Box>
      <Container maxW="container.xl" py="60px">
        <VStack spacing="20px">
          <Image boxSize="100px" src={CheckIcon} alt="Check icon" />
          <Heading>Payment Confirmed</Heading>
          <Text maxW="xl">
            Thank you for buying Candleaf. The nature is grateful to you. Now
            that your order is confirmed it will be ready to ship in 2 days.
            Please check your inbox in the future for your order updates.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Success;
