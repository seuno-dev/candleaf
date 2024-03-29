import React from "react";
import { Button, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import Background from "../../../assets/images/hero-bg.png";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <Stack
      h="sectionH"
      w="full"
      bgImage={Background}
      bgRepeat="no-repeat"
      bgSize="cover"
      bgPosition="center"
      justifyContent="center"
      align="center"
    >
      <VStack
        w={[350, 530, 730]}
        px={[50, 70, 90]}
        py={16}
        bgColor="rgba(247, 248, 250, 0.8)"
        borderRadius={2}
        justifyContent="center"
        align="center"
        textAlign="center"
      >
        <Heading fontWeight="medium" fontSize={40}>
          🌱
          <br />
          The nature candle
        </Heading>
        <Text fontFamily="subheading" fontSize={18}>
          All handmade with natural soy wax, Candleaf is a companion for all
          your pleasure moments
        </Text>
        <Link to="/products">
          <Button mt={["35px", "50px"]} size="hero">
            Discover our collection
          </Button>
        </Link>
      </VStack>
    </Stack>
  );
}

export default HeroSection;
