import React from "react";
import { Button, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import Background from "../../../assets/images/hero-bg.png";

function Hero() {
  return (
    <Stack
      h="calc(100vh - 80px)"
      w="full"
      bgImage={Background}
      bgRepeat="no-repeat"
      bgSize="cover"
      justifyContent="center"
      align="center"
    >
      <VStack
        w={[330, 530, 730]}
        px={[50, 70, 90]}
        py={16}
        bgColor="rgba(247, 248, 250, 0.8)"
        borderRadius={2}
        justifyContent="center"
        align="center"
        textAlign="center"
      >
        <Heading fontSize={40}>
          🌱
          <br />
          The nature candle
        </Heading>
        <Text fontFamily="subheading" fontSize={18}>
          All handmade with natural soy wax, Candleaf is a companion for all
          your pleasure moments
        </Text>
        <Button mt="50px">Discover our collection</Button>
      </VStack>
    </Stack>
  );
}

export default Hero;
